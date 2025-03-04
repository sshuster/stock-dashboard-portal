
# Stock Portfolio Backend

This is the backend for the Stock Portfolio application. It provides APIs for user authentication, stock management, and portfolio tracking.

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

### Stocks
- GET /api/stocks - Get all stocks for the authenticated user
- POST /api/stocks - Add a new stock to the portfolio
- DELETE /api/stocks/:id - Delete a stock from the portfolio
- GET /api/stocks/:symbol/history - Get price history for a stock

### Portfolio
- GET /api/portfolio/summary - Get portfolio summary statistics

### Mock Data
- GET /api/mock/generate - Generate mock data for testing

## Database

The application uses SQLite for data storage. The database file `stock_portfolio.db` will be created automatically when the application starts.
