#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Create database and run migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "Seeding the database..."
npm run seed

echo "Setup complete! You can now run 'npm run dev' to start the development server." 