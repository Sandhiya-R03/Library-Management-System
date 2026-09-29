# Library Management System

A creative, responsive internship-level Library Management System built with:

- React JS + Vite
- Python Django + Django REST Framework
- No MySQL
- No database setup
- In-memory sample data (resets whenever Django restarts)

## Main Features

- Modern responsive dashboard
- Book search with live filtering
- Category and availability filters
- Book details modal
- Issue / return book simulation
- Student/member management
- Add member UI
- Library activity timeline
- Due-date tracking
- Overdue books indicator
- Statistics and analytics
- Quick actions
- Notifications
- Dark/light mode
- Mobile sidebar
- Fully responsive UI
- Django REST API

## Requirements

- Python 3.10+
- Node.js 18+
- VS Code

## Run Backend

Open a terminal in:

`backend`

Windows:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

Backend runs at:
http://127.0.0.1:8000

## Run Frontend

Open another VS Code terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
http://localhost:5173

The frontend automatically calls the Django API.

## Important

There is intentionally NO database.

Do not run:

```bash
python manage.py migrate
```

The project uses only Python lists/dictionaries in memory for demonstration and internship evaluation.

If the Django server restarts, sample issue/return changes reset.

## Project Modules

1. Dashboard
2. Book Management
3. Search & Filter
4. Issue / Return
5. Members
6. Activity
7. Analytics
8. Notifications
9. Responsive UI
10. REST API integration

## Suggested Internship Presentation Flow

1. Explain problem statement.
2. Explain architecture: React -> Django REST API.
3. Show dashboard.
4. Search/filter books.
5. Open book details.
6. Issue a book.
7. Return a book.
8. Add a member.
9. Show activity.
10. Show analytics.
11. Explain why no database was used for this prototype.

## API Endpoints

GET `/api/books/`
GET `/api/books/<id>/`
POST `/api/books/<id>/issue/`
POST `/api/books/<id>/return/`
GET `/api/members/`
POST `/api/members/`
GET `/api/activity/`
GET `/api/stats/`
GET `/api/notifications/`
