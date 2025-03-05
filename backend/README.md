
# Lead Generation Backend

This is the backend for the LeadWise Lead Generation application. It provides APIs for user authentication, campaign management, and lead tracking.

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Flask application:
   ```
   python app.py
   ```

The server will start on http://localhost:5000

## Database

The application uses SQLite for data storage. The database file `lead_generation.db` will be created automatically when the application starts. It contains tables for:

- `users` - User accounts and company information
- `campaigns` - Lead generation campaign details
- `leads` - Leads collected through campaigns

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Login and get authentication token

### Campaigns
- GET /api/campaigns - Get all campaigns for the authenticated user
- POST /api/campaigns - Create a new campaign
- GET /api/campaigns/:id - Get details of a specific campaign

### Leads
- POST /api/campaigns/:id/leads - Add a new lead to a campaign
- PUT /api/campaigns/:id/leads/:leadId - Update lead information

### Dashboard
- GET /api/dashboardStats - Get dashboard statistics for the authenticated user

### Mock Data
- GET /api/mock/generate - Generate mock campaign and lead data for testing

## Database Schema

### Users Table
```
id INTEGER PRIMARY KEY AUTOINCREMENT
username TEXT UNIQUE NOT NULL
email TEXT UNIQUE NOT NULL
password TEXT NOT NULL
is_admin BOOLEAN DEFAULT 0
company_name TEXT
industry TEXT
registration_date TEXT NOT NULL
```

### Campaigns Table
```
id INTEGER PRIMARY KEY AUTOINCREMENT
user_id INTEGER NOT NULL
name TEXT NOT NULL
description TEXT
target_audience TEXT
status TEXT NOT NULL
start_date TEXT NOT NULL
end_date TEXT
budget REAL
FOREIGN KEY (user_id) REFERENCES users (id)
```

### Leads Table
```
id INTEGER PRIMARY KEY AUTOINCREMENT
campaign_id INTEGER NOT NULL
first_name TEXT
last_name TEXT
email TEXT NOT NULL
phone TEXT
company TEXT
job_title TEXT
source TEXT
status TEXT NOT NULL
notes TEXT
date_created TEXT NOT NULL
FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
```
