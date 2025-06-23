<p align="center">
  <img src="https://raw.githubusercontent.com/user/repo/main/public/logo.png" alt="PromptHub Logo" width="120">
</p>

<h1 align="center">✨ PromptHub: The Ultimate Prompt Management System ✨</h1>

<p align="center">
  A sleek and powerful web application built to create, manage, and utilize dynamic text prompt templates with ease.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

---

## 🚀 Key Features

-   **🔑 Admin Dashboard:** A secure, middleware-protected admin panel for full CRUD functionality over prompts and categories.
-   **🔧 Dynamic Variables:** Use `{{variable}}` syntax in your prompts. The app automatically detects variables and generates user-friendly forms.
-   **👁️ Live Preview:** Instantly see how your prompt will look as you customize variables.
-   **📋 One-Click Copy:** Easily copy the final, rendered prompt to your clipboard.
-   **📱 Responsive Design:** A modern UI that looks and works great on any device.

## 🛠️ Tech Stack

| Category      | Technology                                      |
| ------------- | ----------------------------------------------- |
| **Framework** | [Next.js](https://nextjs.org/) (App Router)     |
| **ORM**       | [Prisma](https://www.prisma.io/)                |
| **Database**  | [MySQL](https://www.mysql.com/)                 |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/)        |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)   |

---

## ⚡ Getting Started

Get your local environment up and running in just a few steps.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   A running [MySQL](https://www.mysql.com/) database server

### 2. Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/prompt-hub.git
    cd prompt-hub
    ```

2.  **Run the Setup Script**
    This script will handle everything from creating your `.env` file to running database migrations.
    ```bash
    chmod +x setup.sh
    ./setup.sh
    ```
    *Note: You may need to adjust the database credentials at the top of the `setup.sh` script if you are not using the default `root:password`.*

3.  **Start the Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 📖 How to Use

1.  **Navigate to the Admin Panel**: Go to `/login` and enter the admin password to access the dashboard.
2.  **Create a Prompt**: From the admin dashboard, click "Create New Prompt" and fill out the form. Use the `{{variable}}` syntax to define any dynamic parts.
3.  **Use a Prompt**: Go to the "Prompts" page, find the prompt you want to use, and click "Use."
4.  **Customize and Copy**: Fill in the variables on the customization page and copy the final prompt to your clipboard.

## 📂 Project Structure

A brief overview of the key directories:

```
/
├── app/
│   ├── admin/        # Admin dashboard pages
│   ├── api/          # API routes for backend logic
│   ├── components/   # Shared UI components
│   ├── customize/    # Page for customizing a prompt
│   ├── lib/          # Core libraries (Prisma, etc.)
│   └── page.tsx      # Main homepage
├── prisma/
│   └── schema.prisma # Database schema definition
└── setup.sh          # Automated setup script
```

## 🔐 API Endpoints

The application provides the following RESTful API endpoints under `/api`:

| Method   | Endpoint          | Description                              |
| -------- | ----------------- | ---------------------------------------- |
| `GET`    | `/prompts`        | Fetches all prompts.                     |
| `POST`   | `/prompts`        | Creates a new prompt.                    |
| `GET`    | `/prompts/[id]`   | Fetches a single prompt by its ID.       |
| `PUT`    | `/prompts/[id]`   | Updates an existing prompt.              |
| `DELETE` | `/prompts/[id]`   | Deletes a prompt and its relations.      |

---

##  License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
