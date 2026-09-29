from datetime import date, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

BOOKS = [
    {"id":1,"title":"Clean Code","author":"Robert C. Martin","category":"Programming","isbn":"9780132350884","year":2008,"copies":4,"available":2,"rating":4.8,"shelf":"A-12","color":"violet","description":"A practical guide to writing readable, maintainable and professional software."},
    {"id":2,"title":"Atomic Habits","author":"James Clear","category":"Self Development","isbn":"9781847941831","year":2018,"copies":5,"available":3,"rating":4.9,"shelf":"B-04","color":"blue","description":"A proven framework for building good habits and breaking bad ones."},
    {"id":3,"title":"Python Crash Course","author":"Eric Matthes","category":"Programming","isbn":"9781593279288","year":2019,"copies":5,"available":5,"rating":4.7,"shelf":"A-07","color":"cyan","description":"A hands-on introduction to Python programming with practical projects."},
    {"id":4,"title":"Design Patterns","author":"Erich Gamma et al.","category":"Programming","isbn":"9780201633610","year":1994,"copies":3,"available":1,"rating":4.6,"shelf":"A-18","color":"orange","description":"Classic object-oriented design patterns for reusable software architecture."},
    {"id":5,"title":"The Alchemist","author":"Paulo Coelho","category":"Fiction","isbn":"9780062315007","year":1988,"copies":6,"available":6,"rating":4.7,"shelf":"C-02","color":"emerald","description":"A philosophical story about dreams, purpose and following your path."},
    {"id":6,"title":"Introduction to Algorithms","author":"Thomas H. Cormen","category":"Computer Science","isbn":"9780262046305","year":2009,"copies":4,"available":0,"rating":4.9,"shelf":"A-21","color":"rose","description":"A comprehensive reference for algorithms and data structures."},
    {"id":7,"title":"Database System Concepts","author":"Silberschatz","category":"Computer Science","isbn":"9780078022159","year":2019,"copies":4,"available":2,"rating":4.5,"shelf":"A-25","color":"indigo","description":"Core concepts of database systems, architecture and transaction management."},
    {"id":8,"title":"Atomic Design","author":"Brad Frost","category":"Design","isbn":"9780998296556","year":2016,"copies":2,"available":2,"rating":4.4,"shelf":"D-03","color":"pink","description":"A methodology for creating design systems and scalable interfaces."},
    {"id":9,"title":"Deep Work","author":"Cal Newport","category":"Productivity","isbn":"9781455586691","year":2016,"copies":4,"available":3,"rating":4.6,"shelf":"B-11","color":"teal","description":"Rules for focused success in a distracted world."},
    {"id":10,"title":"Artificial Intelligence","author":"Stuart Russell","category":"AI & ML","isbn":"9780134610993","year":2020,"copies":3,"available":1,"rating":4.8,"shelf":"A-30","color":"purple","description":"A modern introduction to artificial intelligence and intelligent agents."},
    {"id":11,"title":"The Psychology of Money","author":"Morgan Housel","category":"Finance","isbn":"9780857197689","year":2020,"copies":5,"available":4,"rating":4.8,"shelf":"B-17","color":"gold","description":"Timeless lessons on wealth, greed, risk and human behaviour."},
    {"id":12,"title":"You Don't Know JS","author":"Kyle Simpson","category":"Web Development","isbn":"9781491904244","year":2015,"copies":3,"available":2,"rating":4.6,"shelf":"A-34","color":"yellow","description":"A deep and practical exploration of JavaScript fundamentals."},
]

MEMBERS = [
    {"id":101,"name":"Arun Kumar","email":"arun@example.com","course":"CSE","year":"3rd Year","status":"Active","borrowed":2},
    {"id":102,"name":"Priya S","email":"priya@example.com","course":"AIML","year":"3rd Year","status":"Active","borrowed":1},
    {"id":103,"name":"Kavin Raj","email":"kavin@example.com","course":"ECE","year":"2nd Year","status":"Active","borrowed":3},
    {"id":104,"name":"Harini M","email":"harini@example.com","course":"IT","year":"4th Year","status":"Active","borrowed":0},
    {"id":105,"name":"Vishnu V","email":"vishnu@example.com","course":"CSE","year":"3rd Year","status":"Active","borrowed":1},
]

ACTIVITY = [
    {"id":1,"type":"issue","title":"Book issued","detail":"Arun Kumar borrowed Clean Code","time":"Today, 10:42 AM"},
    {"id":2,"type":"return","title":"Book returned","detail":"Priya S returned Atomic Habits","time":"Today, 09:15 AM"},
    {"id":3,"type":"member","title":"New member","detail":"Vishnu V joined the library","time":"Yesterday, 04:30 PM"},
    {"id":4,"type":"issue","title":"Book issued","detail":"Kavin Raj borrowed Database System Concepts","time":"Yesterday, 02:18 PM"},
    {"id":5,"type":"system","title":"System update","detail":"Weekly catalog sync completed","time":"Yesterday, 08:00 AM"},
]

NOTIFICATIONS = [
    {"id":1,"title":"3 books are overdue","detail":"Review overdue loans and contact members.","kind":"warning"},
    {"id":2,"title":"Low stock alert","detail":"Introduction to Algorithms has no available copies.","kind":"danger"},
    {"id":3,"title":"New member registrations","detail":"5 active members are currently registered.","kind":"info"},
]

def json_response(data, status=200):
    return JsonResponse(data, status=status, safe=False)

def books(request):
    query = request.GET.get("search", "").lower()
    category = request.GET.get("category", "").lower()
    available = request.GET.get("available", "")
    result = BOOKS
    if query:
        result = [b for b in result if query in b["title"].lower() or query in b["author"].lower() or query in b["isbn"].lower()]
    if category:
        result = [b for b in result if b["category"].lower() == category]
    if available == "true":
        result = [b for b in result if b["available"] > 0]
    return json_response(result)

def book_detail(request, book_id):
    for b in BOOKS:
        if b["id"] == book_id:
            return json_response(b)
    return json_response({"error":"Book not found"}, 404)

@csrf_exempt
def issue_book(request, book_id):
    if request.method != "POST":
        return json_response({"error":"POST required"}, 405)
    book = next((b for b in BOOKS if b["id"] == book_id), None)
    if not book:
        return json_response({"error":"Book not found"}, 404)
    if book["available"] <= 0:
        return json_response({"error":"No available copy. This book is currently unavailable."}, 400)
    book["available"] -= 1
    ACTIVITY.insert(0, {"id":len(ACTIVITY)+1,"type":"issue","title":"Book issued","detail":f'{book["title"]} was issued successfully',"time":"Just now"})
    return json_response({"message":"Book issued successfully","book":book})

@csrf_exempt
def return_book(request, book_id):
    if request.method != "POST":
        return json_response({"error":"POST required"}, 405)
    book = next((b for b in BOOKS if b["id"] == book_id), None)
    if not book:
        return json_response({"error":"Book not found"}, 404)
    if book["available"] < book["copies"]:
        book["available"] += 1
    ACTIVITY.insert(0, {"id":len(ACTIVITY)+1,"type":"return","title":"Book returned","detail":f'{book["title"]} was returned successfully',"time":"Just now"})
    return json_response({"message":"Book returned successfully","book":book})

def members(request):
    return json_response(MEMBERS)

@csrf_exempt
def create_member(request):
    if request.method != "POST":
        return json_response({"error":"POST required"}, 405)
    try:
        data = json.loads(request.body or "{}")
        if not data.get("name") or not data.get("email"):
            return json_response({"error":"Name and email are required."}, 400)
        member = {
            "id": max([m["id"] for m in MEMBERS], default=100) + 1,
            "name": data["name"], "email": data["email"],
            "course": data.get("course","CSE"), "year": data.get("year","3rd Year"),
            "status":"Active", "borrowed":0
        }
        MEMBERS.append(member)
        ACTIVITY.insert(0, {"id":len(ACTIVITY)+1,"type":"member","title":"New member","detail":f'{member["name"]} joined the library',"time":"Just now"})
        return json_response(member, 201)
    except Exception:
        return json_response({"error":"Invalid request."}, 400)

def activity(request):
    return json_response(ACTIVITY[:12])

def stats(request):
    total = sum(b["copies"] for b in BOOKS)
    available = sum(b["available"] for b in BOOKS)
    issued = total - available
    return json_response({
        "total_books": total,
        "unique_titles": len(BOOKS),
        "available_books": available,
        "issued_books": issued,
        "members": len(MEMBERS),
        "overdue": 3,
        "categories": len(set(b["category"] for b in BOOKS)),
        "monthly_issues": [18,24,21,31,28,35,40,36,43,39,48,52],
        "category_breakdown": [
            {"name":"Programming","value":4},
            {"name":"Computer Science","value":2},
            {"name":"Self Development","value":1},
            {"name":"Fiction","value":1},
            {"name":"Others","value":4}
        ]
    })

def notifications(request):
    return json_response(NOTIFICATIONS)
