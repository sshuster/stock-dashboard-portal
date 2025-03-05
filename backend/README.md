
# Sports Betting Backend

This is the backend for the BetWiser Sports Betting application. It provides APIs for user authentication, sports match management, and bet tracking.

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

The application uses SQLite for data storage. The database file `sports_betting.db` will be created automatically when the application starts. It contains tables for:

- `users` - User accounts and balances
- `matches` - Sports matches information
- `bets` - User betting history

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Login and get authentication token

### Matches
- GET /api/matches - Get all upcoming matches
- GET /api/matches/:id - Get a specific match details
- GET /api/matches/live - Get currently live matches

### Betting
- GET /api/bets - Get all bets for the authenticated user
- POST /api/bets - Place a new bet
- GET /api/bets/history - Get bet history for the authenticated user
- GET /api/betting/summary - Get betting summary statistics

### Mock Data
- GET /api/mock/generate - Generate mock match data for testing

## Database Schema

### Users Table
```
id INTEGER PRIMARY KEY AUTOINCREMENT
username TEXT UNIQUE NOT NULL
email TEXT UNIQUE NOT NULL
password TEXT NOT NULL
is_admin BOOLEAN DEFAULT 0
balance REAL DEFAULT 1000.0
```

### Matches Table
```
id INTEGER PRIMARY KEY AUTOINCREMENT
home_team TEXT NOT NULL
away_team TEXT NOT NULL
sport TEXT NOT NULL
league TEXT NOT NULL
start_time TEXT NOT NULL
home_odds REAL NOT NULL
away_odds REAL NOT NULL
draw_odds REAL
status TEXT NOT NULL
home_score INTEGER
away_score INTEGER
```

### Bets Table
```
id INTEGER PRIMARY KEY AUTOINCREMENT
user_id INTEGER NOT NULL
match_id INTEGER NOT NULL
team_bet_on TEXT NOT NULL
odds REAL NOT NULL
amount REAL NOT NULL
potential REAL NOT NULL
status TEXT NOT NULL
date_created TEXT NOT NULL
FOREIGN KEY (user_id) REFERENCES users (id)
FOREIGN KEY (match_id) REFERENCES matches (id)
```
