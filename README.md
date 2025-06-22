# ✨ PromptHub: The Ultimate Prompt Management System ✨

<p align="center">
  A sleek and powerful web application built with Next.js and MySQL to create, manage, and utilize dynamic text prompt templates with ease.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

---

## 🚀 Features

-   **📝 Full Admin CRUD:** Create, read, update, and delete prompt templates through a secure admin panel.
-   **🔒 Simple Authentication:** A middleware-protected admin route ensures only authorized users can manage prompts.
-   **🎨 Dynamic Variable System:** Use `{{variable}}` syntax in your prompts. The app automatically detects them and generates input fields for users.
-   **👁️ Live Preview:** See the final prompt output in real-time as you fill in the variables.
-   **📋 Copy to Clipboard:** Easily copy the generated prompt with a single click.
-   **📱 Fully Responsive:** A beautiful and modern UI that looks great on all devices, from mobile to desktop.
-   **🚀 Built with Modern Tech:** Leverages the power of the Next.js App Router for a fast and scalable experience.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router)                                                                                                   |
| **ORM**       | [Prisma](https://www.prisma.io/)                                                                                                              |
| **Database**  | [MySQL](https://www.mysql.com/)                                                                                                               |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/)                                                                                                      |
| **UI**        | [React](https://reactjs.org/)                                                                                                                 |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)                                                                                                 |
| **Auth**      | Middleware-based                                                                                                                              |

---

## ⚡ Getting Started

Follow these steps to get a local copy up and running.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   A running [MySQL](https://www.mysql.com/) database server

### 2. Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/prompt-hub.git
    cd prompt-hub
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a `.env` file in the root of your project and add your database connection string. The database name should be `prompthub`.
    ```env
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/prompthub"
    ```
    *Example:* `DATABASE_URL="mysql://root:password@localhost:3306/prompthub"`

4.  **Run Database Migrations**
    This command will create the `prompthub` database if it doesn't exist and set up all the necessary tables.
    ```bash
    npx prisma migrate dev
    ```

5.  **Seed the Database (Optional)**
    To populate the database with some sample prompts, run the seed script:
    ```bash
    npm run seed
    ```

6.  **Start the Development Server**
    It's recommended to run the standard server (without Turbopack) to avoid potential environment issues.
    ```bash
    npm run dev:standard
    ```

7.  **Open Your Browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action!

---

## 📂 Project Structure

Here's a brief overview of the key directories and files:

```
/
├── app/
│   ├── admin/             # Admin dashboard pages and components
│   ├── api/               # API routes for handling all backend logic
│   ├── components/        # Shared UI components (Button, Card, etc.)
│   ├── lib/               # Core libraries (Prisma client, utilities)
│   ├── login/             # Login page for admin access
│   ├── prompt/            # Public-facing page for customizing a prompt
│   └── page.tsx           # The main homepage
├── prisma/
│   └── schema.prisma      # Defines the database models (Prompt, User)
└── middleware.ts          # Handles authentication for the /admin route
```

## 🔐 API Endpoints

The application provides the following RESTful API endpoints:

| Method | Endpoint              | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| `GET`  | `/api/prompts`        | Fetches all prompts (or only published).  |
| `POST` | `/api/prompts`        | Creates a new prompt.                     |
| `GET`  | `/api/prompts/[id]`   | Fetches a single prompt by its ID.        |
| `PUT`  | `/api/prompts/[id]`   | Updates an existing prompt.               |
| `PATCH`| `/api/prompts/[id]`   | Updates a prompt's `isPublished` status.  |
| `DELETE`| `/api/prompts/[id]`  | Deletes a prompt.                         |

---

##  licencja

This project is licensed under the MIT License. See the `LICENSE` file for more details.
