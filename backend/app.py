
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
DB_PATH = os.path.join(os.path.dirname(__file__), 'sports_betting.db')

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
        is_admin BOOLEAN DEFAULT 0,
        balance REAL DEFAULT 1000.0
    )
    ''')
    
    # Create matches table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        home_team TEXT NOT NULL,
        away_team TEXT NOT NULL,
        sport TEXT NOT NULL,
        league TEXT NOT NULL,
        start_time TEXT NOT NULL,
        home_odds REAL NOT NULL,
        away_odds REAL NOT NULL,
        draw_odds REAL,
        status TEXT NOT NULL,
        home_score INTEGER,
        away_score INTEGER
    )
    ''')
    
    # Create bets table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        match_id INTEGER NOT NULL,
        team_bet_on TEXT NOT NULL,
        odds REAL NOT NULL,
        amount REAL NOT NULL,
        potential REAL NOT NULL,
        status TEXT NOT NULL,
        date_created TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (match_id) REFERENCES matches (id)
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
                'isAdmin': False,
                'balance': 1000.0  # Default starting balance
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
            'isAdmin': bool(user['is_admin']),
            'balance': user['balance']
        }
    }), 200

# Match routes
@app.route('/api/matches', methods=['GET'])
def get_matches():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM matches
        WHERE status = 'scheduled' OR status = 'live'
        ORDER BY start_time
    """)
    
    matches_db = cursor.fetchall()
    conn.close()
    
    matches = []
    for match in matches_db:
        matches.append({
            'id': match['id'],
            'homeTeam': match['home_team'],
            'awayTeam': match['away_team'],
            'sport': match['sport'],
            'league': match['league'],
            'startTime': match['start_time'],
            'homeOdds': match['home_odds'],
            'awayOdds': match['away_odds'],
            'drawOdds': match['draw_odds'],
            'status': match['status'],
            'homeScore': match['home_score'],
            'awayScore': match['away_score']
        })
    
    return jsonify(matches), 200

@app.route('/api/matches/<int:match_id>', methods=['GET'])
def get_match(match_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM matches WHERE id = ?", (match_id,))
    
    match = cursor.fetchone()
    conn.close()
    
    if not match:
        return jsonify({'message': 'Match not found'}), 404
    
    return jsonify({
        'id': match['id'],
        'homeTeam': match['home_team'],
        'awayTeam': match['away_team'],
        'sport': match['sport'],
        'league': match['league'],
        'startTime': match['start_time'],
        'homeOdds': match['home_odds'],
        'awayOdds': match['away_odds'],
        'drawOdds': match['draw_odds'],
        'status': match['status'],
        'homeScore': match['home_score'],
        'awayScore': match['away_score']
    }), 200

@app.route('/api/matches/live', methods=['GET'])
def get_live_matches():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM matches WHERE status = 'live' ORDER BY start_time")
    
    matches_db = cursor.fetchall()
    conn.close()
    
    matches = []
    for match in matches_db:
        matches.append({
            'id': match['id'],
            'homeTeam': match['home_team'],
            'awayTeam': match['away_team'],
            'sport': match['sport'],
            'league': match['league'],
            'startTime': match['start_time'],
            'homeOdds': match['home_odds'],
            'awayOdds': match['away_odds'],
            'drawOdds': match['draw_odds'],
            'status': match['status'],
            'homeScore': match['home_score'],
            'awayScore': match['away_score']
        })
    
    return jsonify(matches), 200

# Betting routes
@app.route('/api/bets', methods=['GET'])
@token_required
def get_user_bets(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT b.*, m.home_team, m.away_team 
        FROM bets b
        JOIN matches m ON b.match_id = m.id
        WHERE b.user_id = ?
        ORDER BY b.date_created DESC
    """, (current_user['id'],))
    
    bets_db = cursor.fetchall()
    conn.close()
    
    bets = []
    for bet in bets_db:
        bets.append({
            'id': bet['id'],
            'matchId': bet['match_id'],
            'teamBetOn': bet['team_bet_on'],
            'odds': bet['odds'],
            'amount': bet['amount'],
            'potential': bet['potential'],
            'status': bet['status'],
            'dateCreated': bet['date_created'],
            'homeTeam': bet['home_team'],
            'awayTeam': bet['away_team']
        })
    
    return jsonify(bets), 200

@app.route('/api/bets', methods=['POST'])
@token_required
def place_bet(current_user):
    data = request.get_json()
    
    match_id = data.get('matchId')
    team_bet_on = data.get('teamBetOn')
    odds = data.get('odds')
    amount = data.get('amount')
    
    if not match_id or not team_bet_on or not odds or not amount:
        return jsonify({'message': 'Missing required fields'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user has enough balance
    if current_user['balance'] < amount:
        conn.close()
        return jsonify({'message': 'Insufficient balance'}), 400
        
    # Check if match exists and is not completed
    cursor.execute("SELECT * FROM matches WHERE id = ? AND status != 'completed'", (match_id,))
    match = cursor.fetchone()
    
    if not match:
        conn.close()
        return jsonify({'message': 'Match not found or already completed'}), 404
        
    # Calculate potential winnings
    potential = amount * odds
    
    try:
        # Update user balance
        new_balance = current_user['balance'] - amount
        cursor.execute("UPDATE users SET balance = ? WHERE id = ?", (new_balance, current_user['id']))
        
        # Create new bet
        cursor.execute(
            """INSERT INTO bets 
               (user_id, match_id, team_bet_on, odds, amount, potential, status, date_created) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (current_user['id'], match_id, team_bet_on, odds, amount, potential, 'pending', datetime.now().isoformat())
        )
        
        conn.commit()
        
        # Get the new bet's ID
        cursor.execute("SELECT last_insert_rowid()")
        bet_id = cursor.fetchone()[0]
        
        return jsonify({
            'message': 'Bet placed successfully',
            'bet': {
                'id': bet_id,
                'matchId': match_id,
                'teamBetOn': team_bet_on,
                'odds': odds,
                'amount': amount,
                'potential': potential,
                'status': 'pending',
                'dateCreated': datetime.now().isoformat()
            },
            'newBalance': new_balance
        }), 201
    finally:
        conn.close()

@app.route('/api/bets/history', methods=['GET'])
@token_required
def get_bet_history(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT b.*, m.home_team, m.away_team 
        FROM bets b
        JOIN matches m ON b.match_id = m.id
        WHERE b.user_id = ?
        ORDER BY b.date_created DESC
    """, (current_user['id'],))
    
    bets_db = cursor.fetchall()
    conn.close()
    
    bets = []
    for bet in bets_db:
        bets.append({
            'id': bet['id'],
            'matchId': bet['match_id'],
            'teamBetOn': bet['team_bet_on'],
            'odds': bet['odds'],
            'amount': bet['amount'],
            'potential': bet['potential'],
            'status': bet['status'],
            'dateCreated': bet['date_created'],
            'homeTeam': bet['home_team'],
            'awayTeam': bet['away_team']
        })
    
    return jsonify(bets), 200

@app.route('/api/betting/summary', methods=['GET'])
@token_required
def get_betting_summary(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get total number of bets
    cursor.execute("SELECT COUNT(*) as total FROM bets WHERE user_id = ?", (current_user['id'],))
    total_bets = cursor.fetchone()['total']
    
    # Get number of pending bets
    cursor.execute("SELECT COUNT(*) as pending FROM bets WHERE user_id = ? AND status = 'pending'", (current_user['id'],))
    pending_bets = cursor.fetchone()['pending']
    
    # Get total amount wagered
    cursor.execute("SELECT SUM(amount) as total_wagered FROM bets WHERE user_id = ?", (current_user['id'],))
    total_wagered = cursor.fetchone()['total_wagered'] or 0
    
    # Get total amount won
    cursor.execute("SELECT SUM(potential) as total_won FROM bets WHERE user_id = ? AND status = 'won'", (current_user['id'],))
    total_won = cursor.fetchone()['total_won'] or 0
    
    # Get number of won bets
    cursor.execute("SELECT COUNT(*) as won FROM bets WHERE user_id = ? AND status = 'won'", (current_user['id'],))
    won_bets = cursor.fetchone()['won']
    
    conn.close()
    
    # Calculate net profit
    net_profit = total_won - total_wagered
    
    # Calculate win rate
    win_rate = (won_bets / total_bets * 100) if total_bets > 0 else 0
    
    return jsonify({
        'totalBets': total_bets,
        'pendingBets': pending_bets,
        'totalWagered': total_wagered,
        'totalWon': total_won,
        'netProfit': net_profit,
        'winRate': win_rate
    }), 200

# Generate mock match data
@app.route('/api/mock/generate', methods=['GET'])
def generate_mock_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Clear existing match data
    cursor.execute("DELETE FROM matches")
    
    # Sample sports and leagues
    sports_leagues = {
        'football': ['NFL', 'NCAA'],
        'basketball': ['NBA', 'NCAA'],
        'baseball': ['MLB'],
        'hockey': ['NHL'],
        'soccer': ['Premier League', 'La Liga', 'MLS']
    }
    
    # Sample team names
    teams = {
        'football': {
            'NFL': ['Chiefs', 'Eagles', 'Bills', '49ers', 'Cowboys', 'Ravens', 'Bengals', 'Lions'],
            'NCAA': ['Alabama', 'Georgia', 'Ohio State', 'Michigan', 'Texas', 'Oregon', 'Florida State', 'Penn State']
        },
        'basketball': {
            'NBA': ['Celtics', 'Nuggets', 'Bucks', 'Timberwolves', 'Lakers', 'Knicks', 'Thunder', 'Heat'],
            'NCAA': ['UConn', 'Purdue', 'Houston', 'Tennessee', 'Arizona', 'Kansas', 'Duke', 'North Carolina']
        },
        'baseball': {
            'MLB': ['Dodgers', 'Yankees', 'Braves', 'Phillies', 'Astros', 'Orioles', 'Rangers', 'Rays']
        },
        'hockey': {
            'NHL': ['Bruins', 'Panthers', 'Rangers', 'Stars', 'Oilers', 'Hurricanes', 'Golden Knights', 'Avalanche']
        },
        'soccer': {
            'Premier League': ['Man City', 'Arsenal', 'Liverpool', 'Man United', 'Chelsea', 'Newcastle', 'Tottenham', 'Brighton'],
            'La Liga': ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Athletic Bilbao', 'Girona', 'Real Sociedad', 'Valencia', 'Villarreal'],
            'MLS': ['Inter Miami', 'Cincinnati', 'Columbus', 'Orlando', 'LAFC', 'Seattle', 'Atlanta', 'LA Galaxy']
        }
    }
    
    # Generate matches for each sport and league
    import random
    from datetime import timedelta
    
    match_id = 1
    
    for sport, leagues in sports_leagues.items():
        for league in leagues:
            league_teams = teams[sport][league]
            teams_copy = league_teams.copy()
            
            # Create matchups
            for _ in range(4):  # 4 matches per league
                if len(teams_copy) < 2:
                    teams_copy = league_teams.copy()
                
                # Select two teams
                home_team = random.choice(teams_copy)
                teams_copy.remove(home_team)
                away_team = random.choice(teams_copy)
                teams_copy.remove(away_team)
                
                # Generate random start time (between now and 7 days from now)
                hours_offset = random.randint(1, 7 * 24)
                start_time = (datetime.now() + timedelta(hours=hours_offset)).isoformat()
                
                # Generate random odds
                home_odds = round(random.uniform(1.5, 4.0), 2)
                away_odds = round(random.uniform(1.5, 4.0), 2)
                draw_odds = round(random.uniform(3.0, 8.0), 2) if sport == 'soccer' else None
                
                # Insert match into database
                cursor.execute(
                    """INSERT INTO matches 
                       (id, home_team, away_team, sport, league, start_time, home_odds, away_odds, draw_odds, status) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (match_id, home_team, away_team, sport, league, start_time, home_odds, away_odds, draw_odds, 'scheduled')
                )
                
                match_id += 1
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Mock match data generated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
