
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
- GET /api/mock/generate - Generate mock data for testing

## Database

The application uses SQLite for data storage. The database file `sports_betting.db` will be created automatically when the application starts.
