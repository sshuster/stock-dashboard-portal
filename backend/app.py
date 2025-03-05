
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
DB_PATH = os.path.join(os.path.dirname(__file__), 'lead_generation.db')

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
        company_name TEXT,
        industry TEXT,
        registration_date TEXT NOT NULL
    )
    ''')
    
    # Create campaigns table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        target_audience TEXT,
        status TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        budget REAL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create leads table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER NOT NULL,
        first_name TEXT,
        last_name TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        job_title TEXT,
        source TEXT,
        status TEXT NOT NULL,
        notes TEXT,
        date_created TEXT NOT NULL,
        FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
    )
    ''')
    
    # Insert a default admin user if not exists
    cursor.execute("SELECT * FROM users WHERE username = 'admin'")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (username, email, password, is_admin, registration_date) VALUES (?, ?, ?, ?, ?)",
            ('admin', 'admin@example.com', generate_password_hash('admin'), True, datetime.now().isoformat())
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
    company_name = data.get('companyName')
    industry = data.get('industry')
    
    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
        
    hashed_password = generate_password_hash(password)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO users (username, email, password, company_name, industry, registration_date) VALUES (?, ?, ?, ?, ?, ?)",
            (username, email, hashed_password, company_name, industry, datetime.now().isoformat())
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
                'companyName': company_name,
                'industry': industry
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
            'companyName': user['company_name'],
            'industry': user['industry']
        }
    }), 200

# Campaign routes
@app.route('/api/campaigns', methods=['GET'])
@token_required
def get_campaigns(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM campaigns 
        WHERE user_id = ? 
        ORDER BY start_date DESC
    """, (current_user['id'],))
    
    campaigns_db = cursor.fetchall()
    conn.close()
    
    campaigns = []
    for campaign in campaigns_db:
        campaigns.append({
            'id': campaign['id'],
            'name': campaign['name'],
            'description': campaign['description'],
            'targetAudience': campaign['target_audience'],
            'status': campaign['status'],
            'startDate': campaign['start_date'],
            'endDate': campaign['end_date'],
            'budget': campaign['budget']
        })
    
    return jsonify(campaigns), 200

@app.route('/api/campaigns', methods=['POST'])
@token_required
def create_campaign(current_user):
    data = request.get_json()
    
    name = data.get('name')
    description = data.get('description')
    target_audience = data.get('targetAudience')
    status = data.get('status', 'draft')
    start_date = data.get('startDate', datetime.now().isoformat())
    end_date = data.get('endDate')
    budget = data.get('budget')
    
    if not name:
        return jsonify({'message': 'Campaign name is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            """INSERT INTO campaigns 
               (user_id, name, description, target_audience, status, start_date, end_date, budget) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (current_user['id'], name, description, target_audience, status, start_date, end_date, budget)
        )
        
        conn.commit()
        
        # Get the new campaign's ID
        cursor.execute("SELECT last_insert_rowid()")
        campaign_id = cursor.fetchone()[0]
        
        return jsonify({
            'message': 'Campaign created successfully',
            'campaign': {
                'id': campaign_id,
                'name': name,
                'description': description,
                'targetAudience': target_audience,
                'status': status,
                'startDate': start_date,
                'endDate': end_date,
                'budget': budget
            }
        }), 201
    finally:
        conn.close()

@app.route('/api/campaigns/<int:campaign_id>', methods=['GET'])
@token_required
def get_campaign(current_user, campaign_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM campaigns 
        WHERE id = ? AND user_id = ?
    """, (campaign_id, current_user['id']))
    
    campaign = cursor.fetchone()
    
    if not campaign:
        conn.close()
        return jsonify({'message': 'Campaign not found'}), 404
    
    # Get the leads for this campaign
    cursor.execute("""
        SELECT * FROM leads 
        WHERE campaign_id = ? 
        ORDER BY date_created DESC
    """, (campaign_id,))
    
    leads_db = cursor.fetchall()
    conn.close()
    
    leads = []
    for lead in leads_db:
        leads.append({
            'id': lead['id'],
            'firstName': lead['first_name'],
            'lastName': lead['last_name'],
            'email': lead['email'],
            'phone': lead['phone'],
            'company': lead['company'],
            'jobTitle': lead['job_title'],
            'source': lead['source'],
            'status': lead['status'],
            'notes': lead['notes'],
            'dateCreated': lead['date_created']
        })
    
    return jsonify({
        'id': campaign['id'],
        'name': campaign['name'],
        'description': campaign['description'],
        'targetAudience': campaign['target_audience'],
        'status': campaign['status'],
        'startDate': campaign['start_date'],
        'endDate': campaign['end_date'],
        'budget': campaign['budget'],
        'leads': leads
    }), 200

# Lead routes
@app.route('/api/campaigns/<int:campaign_id>/leads', methods=['POST'])
@token_required
def add_lead(current_user, campaign_id):
    data = request.get_json()
    
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if the campaign exists and belongs to the current user
    cursor.execute("""
        SELECT * FROM campaigns 
        WHERE id = ? AND user_id = ?
    """, (campaign_id, current_user['id']))
    
    campaign = cursor.fetchone()
    if not campaign:
        conn.close()
        return jsonify({'message': 'Campaign not found'}), 404
    
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone = data.get('phone')
    company = data.get('company')
    job_title = data.get('jobTitle')
    source = data.get('source')
    status = data.get('status', 'new')
    notes = data.get('notes')
    
    try:
        cursor.execute(
            """INSERT INTO leads 
               (campaign_id, first_name, last_name, email, phone, company, job_title, source, status, notes, date_created) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (campaign_id, first_name, last_name, email, phone, company, job_title, source, status, notes, datetime.now().isoformat())
        )
        
        conn.commit()
        
        # Get the new lead's ID
        cursor.execute("SELECT last_insert_rowid()")
        lead_id = cursor.fetchone()[0]
        
        return jsonify({
            'message': 'Lead added successfully',
            'lead': {
                'id': lead_id,
                'firstName': first_name,
                'lastName': last_name,
                'email': email,
                'phone': phone,
                'company': company,
                'jobTitle': job_title,
                'source': source,
                'status': status,
                'notes': notes,
                'dateCreated': datetime.now().isoformat()
            }
        }), 201
    finally:
        conn.close()

@app.route('/api/campaigns/<int:campaign_id>/leads/<int:lead_id>', methods=['PUT'])
@token_required
def update_lead(current_user, campaign_id, lead_id):
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if the campaign exists and belongs to the current user
    cursor.execute("""
        SELECT * FROM campaigns 
        WHERE id = ? AND user_id = ?
    """, (campaign_id, current_user['id']))
    
    campaign = cursor.fetchone()
    if not campaign:
        conn.close()
        return jsonify({'message': 'Campaign not found'}), 404
    
    # Check if the lead exists and belongs to the campaign
    cursor.execute("""
        SELECT * FROM leads 
        WHERE id = ? AND campaign_id = ?
    """, (lead_id, campaign_id))
    
    lead = cursor.fetchone()
    if not lead:
        conn.close()
        return jsonify({'message': 'Lead not found'}), 404
    
    first_name = data.get('firstName', lead['first_name'])
    last_name = data.get('lastName', lead['last_name'])
    email = data.get('email', lead['email'])
    phone = data.get('phone', lead['phone'])
    company = data.get('company', lead['company'])
    job_title = data.get('jobTitle', lead['job_title'])
    source = data.get('source', lead['source'])
    status = data.get('status', lead['status'])
    notes = data.get('notes', lead['notes'])
    
    try:
        cursor.execute(
            """UPDATE leads 
               SET first_name = ?, last_name = ?, email = ?, phone = ?, company = ?, 
                   job_title = ?, source = ?, status = ?, notes = ? 
               WHERE id = ?""",
            (first_name, last_name, email, phone, company, job_title, source, status, notes, lead_id)
        )
        
        conn.commit()
        
        return jsonify({
            'message': 'Lead updated successfully',
            'lead': {
                'id': lead_id,
                'firstName': first_name,
                'lastName': last_name,
                'email': email,
                'phone': phone,
                'company': company,
                'jobTitle': job_title,
                'source': source,
                'status': status,
                'notes': notes,
                'dateCreated': lead['date_created']
            }
        }), 200
    finally:
        conn.close()

@app.route('/api/dashboardStats', methods=['GET'])
@token_required
def get_dashboard_stats(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get total number of campaigns
    cursor.execute("SELECT COUNT(*) as total FROM campaigns WHERE user_id = ?", (current_user['id'],))
    total_campaigns = cursor.fetchone()['total']
    
    # Get number of active campaigns
    cursor.execute("SELECT COUNT(*) as active FROM campaigns WHERE user_id = ? AND status = 'active'", (current_user['id'],))
    active_campaigns = cursor.fetchone()['active']
    
    # Get total number of leads
    cursor.execute("""
        SELECT COUNT(*) as total FROM leads 
        JOIN campaigns ON leads.campaign_id = campaigns.id 
        WHERE campaigns.user_id = ?
    """, (current_user['id'],))
    total_leads = cursor.fetchone()['total']
    
    # Get number of leads by status
    cursor.execute("""
        SELECT leads.status, COUNT(*) as count FROM leads 
        JOIN campaigns ON leads.campaign_id = campaigns.id 
        WHERE campaigns.user_id = ? 
        GROUP BY leads.status
    """, (current_user['id'],))
    status_counts = cursor.fetchall()
    
    leads_by_status = {}
    for status in status_counts:
        leads_by_status[status['status']] = status['count']
    
    # Get recent leads
    cursor.execute("""
        SELECT leads.*, campaigns.name as campaign_name FROM leads 
        JOIN campaigns ON leads.campaign_id = campaigns.id 
        WHERE campaigns.user_id = ? 
        ORDER BY leads.date_created DESC LIMIT 5
    """, (current_user['id'],))
    recent_leads_db = cursor.fetchall()
    
    recent_leads = []
    for lead in recent_leads_db:
        recent_leads.append({
            'id': lead['id'],
            'firstName': lead['first_name'],
            'lastName': lead['last_name'],
            'email': lead['email'],
            'campaignName': lead['campaign_name'],
            'status': lead['status'],
            'dateCreated': lead['date_created']
        })
    
    conn.close()
    
    return jsonify({
        'totalCampaigns': total_campaigns,
        'activeCampaigns': active_campaigns,
        'totalLeads': total_leads,
        'leadsByStatus': leads_by_status,
        'recentLeads': recent_leads
    }), 200

# Generate mock campaign data
@app.route('/api/mock/generate', methods=['GET'])
def generate_mock_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if admin user exists
    cursor.execute("SELECT id FROM users WHERE username = 'admin'")
    admin = cursor.fetchone()
    if not admin:
        conn.close()
        return jsonify({'message': 'Admin user not found'}), 404
    
    admin_id = admin['id']
    
    # Sample campaign data
    campaigns = [
        {
            'name': 'Summer Email Campaign',
            'description': 'Email campaign targeting small business owners for our summer promotion',
            'target_audience': 'Small business owners, 25-55 years old',
            'status': 'active',
            'budget': 5000
        },
        {
            'name': 'Social Media Lead Generation',
            'description': 'Facebook and Instagram ads to generate leads for sales team',
            'target_audience': 'Marketing professionals, 23-45 years old',
            'status': 'active',
            'budget': 3500
        },
        {
            'name': 'Website Conversion Optimization',
            'description': 'A/B testing and optimization for landing page conversions',
            'target_audience': 'Website visitors, existing customers',
            'status': 'draft',
            'budget': 2000
        },
        {
            'name': 'Trade Show Lead Collection',
            'description': 'Lead collection system for upcoming industry trade show',
            'target_audience': 'Industry professionals, decision makers',
            'status': 'planned',
            'budget': 7500
        }
    ]
    
    # Sample lead sources
    sources = ['Website', 'Social Media', 'Email', 'Referral', 'Trade Show', 'Cold Call', 'Webinar']
    
    # Sample lead statuses
    statuses = ['new', 'contacted', 'qualified', 'converted', 'unqualified']
    
    # Sample companies
    companies = ['Acme Inc.', 'Globex Corporation', 'Initech', 'Wayne Enterprises', 'Stark Industries', 
                'Umbrella Corporation', 'Cyberdyne Systems', 'Aperture Science', 'Weyland-Yutani Corp']
    
    # Sample job titles
    job_titles = ['CEO', 'CTO', 'CMO', 'Marketing Manager', 'VP Sales', 'Director of Operations', 
                 'Business Development Manager', 'Product Manager', 'IT Director']
    
    from datetime import timedelta
    import random
    
    # Clear existing campaign and lead data for admin
    cursor.execute("DELETE FROM leads WHERE campaign_id IN (SELECT id FROM campaigns WHERE user_id = ?)", (admin_id,))
    cursor.execute("DELETE FROM campaigns WHERE user_id = ?", (admin_id,))
    
    # Insert campaigns
    for idx, campaign in enumerate(campaigns):
        start_date = (datetime.now() - timedelta(days=random.randint(5, 60))).isoformat()
        end_date = (datetime.now() + timedelta(days=random.randint(30, 120))).isoformat() if campaign['status'] != 'completed' else None
        
        cursor.execute(
            """INSERT INTO campaigns 
               (user_id, name, description, target_audience, status, start_date, end_date, budget) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (admin_id, campaign['name'], campaign['description'], campaign['target_audience'], 
             campaign['status'], start_date, end_date, campaign['budget'])
        )
        
        # Get the new campaign's ID
        cursor.execute("SELECT last_insert_rowid()")
        campaign_id = cursor.fetchone()[0]
        
        # Generate leads for this campaign
        for _ in range(random.randint(5, 20)):
            first_name = f"FirstName{random.randint(1, 1000)}"
            last_name = f"LastName{random.randint(1, 1000)}"
            email = f"{first_name.lower()}.{last_name.lower()}@example.com"
            phone = f"555-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
            company = random.choice(companies)
            job_title = random.choice(job_titles)
            source = random.choice(sources)
            status = random.choice(statuses)
            notes = "Sample lead notes" if random.random() > 0.7 else None
            date_created = (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat()
            
            cursor.execute(
                """INSERT INTO leads 
                   (campaign_id, first_name, last_name, email, phone, company, job_title, source, status, notes, date_created) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (campaign_id, first_name, last_name, email, phone, company, job_title, source, status, notes, date_created)
            )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Mock campaign and lead data generated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
