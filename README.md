# Ethara.AI HRMS Lite

A lightweight Human Resource Management System (HRMS) designed to manage employee records and track daily attendance efficiently. This project consists of a React frontend and a FastAPI backend powered by MongoDB.

## 🚀 Features

* **Dashboard:** Real-time overview of workforce statistics, department distribution, and recent activity logs.
* **Employee Management:** Add, remove, and search for employees. Filter by department.
* **Attendance Tracking:** Mark employees as Present/Absent for specific dates using a calendar view.
* **Analytics:** View individual attendance summaries, including presence rates and total days tracked.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* Shadcn UI (Components)
* Lucide React (Icons)

**Backend:**
* Python (FastAPI)
* MongoDB (Motor Async Driver)
* Pydantic (Data Validation)

---

## ⚙️ Setup & Installation

### 1. Backend Setup (FastAPI)

Prerequisites: Python 3.8+ and a MongoDB instance (local or Atlas).

1.  **Navigate to the server directory:**
    ```bash
    cd backend
    ```

2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    Create a file named `requirements.txt` with the following content, then install it:
    
    *requirements.txt content:*
    ```text
    fastapi
    uvicorn
    motor
    pydantic
    python-multipart
    ```

    *Install command:*
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment:**
    Set up your MongoDB connection. You can export variables in your terminal or create a `.env` file (if using `python-dotenv`).
    
    ```bash
    # Linux/Mac
    export MONGO_URL="mongodb://localhost:27017"
    export DB_NAME="ethara_db"
    
    # Windows (Powershell)
    $env:MONGO_URL="mongodb://localhost:27017"
    $env:DB_NAME="ethara_db"
    ```

5.  **Run the Server:**
    ```bash
    uvicorn server:app --reload
    ```
    The backend will start at `http://localhost:8000`.

### 2. Frontend Setup (React)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm run dev
    ```
    The frontend will typically run at `http://localhost:5173`.

---
