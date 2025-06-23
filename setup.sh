#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
DB_USER="root"
DB_PASS="password"
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="prompthub"
# --- End Configuration ---

# 1. Create .env file from .env.example if it doesn't exist
if [ -f .env ]; then
    echo ".env file already exists. Skipping creation."
else
    echo "Creating .env file..."
    # This automatically creates the DATABASE_URL
    echo "DATABASE_URL=\"mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}\"" > .env
    echo ".env file created successfully."
fi

# 2. Install npm dependencies
echo "Installing dependencies..."
npm install

# 3. Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

# 4. Seed the database
echo "Seeding the database with sample data..."
npm run seed

echo "✅ Setup complete! You can now start the development server with 'npm run dev'" 