
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production
app.config['JWT_EXPIRATION_SECONDS'] = 86400  # 24 hours

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), 'stock_portfolio.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT 0
    )
    ''')
    
    # Create stocks table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symbol TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        purchase_price REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create stock history table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stock_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        date TEXT NOT NULL,
        price REAL NOT NULL
    )
    ''')
    
    # Insert a default admin user if not exists
    cursor.execute("SELECT * FROM users WHERE username = 'admin'")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)",
            ('admin', 'admin@example.com', generate_password_hash('admin'), True)
        )
    
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize the database on startup
@app.before_first_request
def before_first_request():
    init_db()

# Helper function to generate JWT token
def generate_token(user_id, username, is_admin):
    payload = {
        'exp': datetime.utcnow() + timedelta(seconds=app.config['JWT_EXPIRATION_SECONDS']),
        'iat': datetime.utcnow(),
        'sub': user_id,
        'username': username,
        'isAdmin': is_admin
    }
    return jwt.encode(
        payload,
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )

# Middleware to verify JWT token
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing or invalid'}), 401

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['sub']
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (current_user_id,))
            current_user = cursor.fetchone()
            conn.close()
            
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
                
        except Exception as e:
            return jsonify({'message': 'Token is invalid', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
        
    hashed_password = generate_password_hash(password)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )
        conn.commit()
        
        # Get the new user's ID
        cursor.execute("SELECT last_insert_rowid()")
        user_id = cursor.fetchone()[0]
        
        # Generate token
        token = generate_token(user_id, username, False)
        
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': user_id,
                'username': username,
                'email': email,
                'isAdmin': False
            }
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Username or email already exists'}), 409
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid username or password'}), 401
        
    token = generate_token(user['id'], user['username'], user['is_admin'])
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'isAdmin': bool(user['is_admin'])
        }
    }), 200

# Stock portfolio routes
@app.route('/api/stocks', methods=['GET'])
@token_required
def get_stocks(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT s.id, s.symbol, s.name, s.quantity, s.purchase_price, 
               (SELECT price FROM stock_history 
                WHERE symbol = s.symbol 
                ORDER BY date DESC LIMIT 1) as current_price
        FROM stocks s
        WHERE s.user_id = ?
    """, (current_user['id'],))
    
    stocks_db = cursor.fetchall()
    conn.close()
    
    stocks = []
    for stock in stocks_db:
        current_price = stock['current_price'] or 0  # Default to 0 if no price history
        change = current_price - stock['purchase_price']
        change_percent = (change / stock['purchase_price'] * 100) if stock['purchase_price'] > 0 else 0
        
        stocks.append({
            'id': stock['id'],
            'symbol': stock['symbol'],
            'name': stock['name'],
            'quantity': stock['quantity'],
            'purchasePrice': stock['purchase_price'],
            'price': current_price,
            'change': change,
            'changePercent': change_percent
        })
    
    return jsonify(stocks), 200

@app.route('/api/stocks', methods=['POST'])
@token_required
def add_stock(current_user):
    data = request.get_json()
    
    symbol = data.get('symbol')
    name = data.get('name')
    quantity = data.get('quantity')
    purchase_price = data.get('purchasePrice')
    
    if not symbol or not name or not quantity or not purchase_price:
        return jsonify({'message': 'Missing required fields'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if the stock already exists for this user
    cursor.execute(
        "SELECT * FROM stocks WHERE user_id = ? AND symbol = ?",
        (current_user['id'], symbol)
    )
    existing_stock = cursor.fetchone()
    
    if existing_stock:
        # Update existing stock quantity and average down the purchase price
        new_quantity = existing_stock['quantity'] + quantity
        new_purchase_price = ((existing_stock['quantity'] * existing_stock['purchase_price']) + 
                             (quantity * purchase_price)) / new_quantity
        
        cursor.execute(
            "UPDATE stocks SET quantity = ?, purchase_price = ? WHERE id = ?",
            (new_quantity, new_purchase_price, existing_stock['id'])
        )
    else:
        # Add new stock
        cursor.execute(
            "INSERT INTO stocks (user_id, symbol, name, quantity, purchase_price) VALUES (?, ?, ?, ?, ?)",
            (current_user['id'], symbol, name, quantity, purchase_price)
        )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Stock added successfully'}), 201

@app.route('/api/stocks/<int:stock_id>', methods=['DELETE'])
@token_required
def delete_stock(current_user, stock_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if the stock belongs to the current user
    cursor.execute(
        "SELECT * FROM stocks WHERE id = ? AND user_id = ?",
        (stock_id, current_user['id'])
    )
    stock = cursor.fetchone()
    
    if not stock:
        conn.close()
        return jsonify({'message': 'Stock not found or not authorized'}), 404
        
    cursor.execute("DELETE FROM stocks WHERE id = ?", (stock_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Stock deleted successfully'}), 200

@app.route('/api/stocks/<string:symbol>/history', methods=['GET'])
@token_required
def get_stock_history(current_user, symbol):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT date, price FROM stock_history WHERE symbol = ? ORDER BY date",
        (symbol,)
    )
    
    history_db = cursor.fetchall()
    conn.close()
    
    history = [{'date': item['date'], 'price': item['price']} for item in history_db]
    
    return jsonify(history), 200

@app.route('/api/portfolio/summary', methods=['GET'])
@token_required
def get_portfolio_summary(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            COUNT(*) as total_stocks,
            SUM(s.quantity * s.purchase_price) as total_investment,
            SUM(s.quantity * COALESCE(
                (SELECT price FROM stock_history 
                WHERE symbol = s.symbol 
                ORDER BY date DESC LIMIT 1), 
                s.purchase_price)
            ) as total_current_value
        FROM stocks s
        WHERE s.user_id = ?
    """, (current_user['id'],))
    
    summary = cursor.fetchone()
    conn.close()
    
    total_investment = summary['total_investment'] or 0
    total_current_value = summary['total_current_value'] or 0
    total_gain = total_current_value - total_investment
    total_gain_percent = (total_gain / total_investment * 100) if total_investment > 0 else 0
    
    return jsonify({
        'totalStocks': summary['total_stocks'],
        'totalValue': total_current_value,
        'totalGain': total_gain,
        'totalGainPercent': total_gain_percent
    }), 200

# Generate mock stock data
@app.route('/api/mock/generate', methods=['GET'])
def generate_mock_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Clear existing history data
    cursor.execute("DELETE FROM stock_history")
    
    # Sample stock symbols
    symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'BAC', 'WMT']
    
    # Generate 30 days of history for each symbol
    today = datetime.now()
    
    for symbol in symbols:
        base_price = {
            'AAPL': 150.0,
            'MSFT': 300.0,
            'GOOGL': 130.0,
            'AMZN': 140.0,
            'META': 310.0,
            'TSLA': 240.0,
            'NVDA': 450.0,
            'JPM': 170.0,
            'BAC': 35.0,
            'WMT': 60.0
        }.get(symbol, 100.0)
        
        # Generate 30 days of price history with some randomness
        import random
        volatility = 0.02  # 2% daily volatility
        
        for i in range(30):
            date = (today - timedelta(days=29-i)).strftime('%Y-%m-%d')
            # Random daily change with some momentum
            change = random.normalvariate(0, volatility)
            base_price *= (1 + change)
            
            cursor.execute(
                "INSERT INTO stock_history (symbol, date, price) VALUES (?, ?, ?)",
                (symbol, date, round(base_price, 2))
            )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Mock data generated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
