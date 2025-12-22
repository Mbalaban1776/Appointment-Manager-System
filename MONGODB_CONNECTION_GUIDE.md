# MongoDB Connection Guide

This guide will help you set up and connect MongoDB to your Appointment Management System backend.

## Option 1: Local MongoDB Installation

### Install MongoDB

**On Linux (Fedora):**
```bash
# Add MongoDB repository
sudo dnf install -y mongodb mongodb-server

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### Configure Connection

1. MongoDB will run on `mongodb://localhost:27017` by default
2. Update your `.env` file in `appointment-backend/`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/appointments_db
   ```

3. Test the connection by starting your backend:
   ```bash
   cd appointment-backend
   npm run dev
   ```

You should see: `MongoDB connected successfully`

## Option 2: MongoDB Atlas (Cloud - Recommended for Development)

MongoDB Atlas offers a free tier (M0) perfect for development.

### Setup Steps

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose the FREE (M0) tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add only your server IPs
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

6. **Update .env File:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/appointments_db?retryWrites=true&w=majority
   ```
   Replace:
   - `username` with your database username
   - `password` with your database password
   - `cluster0.xxxxx` with your actual cluster name
   - Add `/appointments_db` before the `?` to specify the database name

## Verify Connection

1. Start your backend server:
   ```bash
   cd appointment-backend
   npm run dev
   ```

2. Check the console output. You should see:
   ```
   MongoDB connected successfully
   Server running on port 3000
   ```

3. Test the API:
   ```bash
   curl http://localhost:3000/health
   ```

## Troubleshooting

### Connection Refused (Local MongoDB)
- Ensure MongoDB service is running: `sudo systemctl status mongod`
- Check MongoDB logs: `sudo journalctl -u mongod`
- Verify MongoDB is listening on port 27017: `netstat -an | grep 27017`

### Authentication Failed (Atlas)
- Double-check username and password in connection string
- Ensure database user has proper permissions
- Verify network access allows your IP address

### Connection Timeout (Atlas)
- Check if your IP is whitelisted in Network Access
- Verify firewall isn't blocking the connection
- Try using the connection string with `retryWrites=true&w=majority` parameters

## Next Steps

Once MongoDB is connected, you can:
1. Test user registration: `POST /api/v1/auth/register`
2. Test user login: `POST /api/v1/auth/login`
3. Check the database using MongoDB Compass or Atlas UI

