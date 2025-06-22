# PromptHub - Prompt Management System

A web application built with Next.js and MySQL that allows you to create, manage, and use text prompts with dynamic variables.

## Features

- **Admin Panel** to create, edit, and delete prompt templates
- **User Interface** for browsing prompts and filling in variables
- Dynamic variable detection and replacement (using `{{variable}}` syntax)
- Live preview of prompts with filled variables
- Copy to clipboard functionality
- Responsive design for all devices

## Tech Stack

- **Frontend & Backend**: Next.js (App Router)
- **ORM**: Prisma with MySQL
- **UI Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MySQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/prompt-hub.git
cd prompt-hub
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a `.env` file in the root directory with the following content:

```
DATABASE_URL="mysql://username:password@localhost:3306/prompt-hub"
```

Replace `username` and `password` with your MySQL credentials.

4. Set up the database:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Admin Panel

Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin) to:

- Create new prompt templates
- Edit existing templates
- Delete templates
- Publish or unpublish templates

### User Interface

The main page at [http://localhost:3000](http://localhost:3000) allows users to:

- Browse published prompts
- Select a prompt to customize
- Fill in variables
- See a live preview of the final prompt
- Copy the final prompt to clipboard

## Database Schema

The application uses a simple database schema:

- `Prompt` model:
  - `id`: integer (primary key)
  - `title`: string
  - `content`: text (with `{{variable}}` placeholders)
  - `isPublished`: boolean
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

## License

This project is licensed under the MIT License.
