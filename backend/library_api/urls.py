from django.urls import path
from .views import (
    books, book_detail, issue_book, return_book,
    members, create_member, activity, stats, notifications
)

urlpatterns = [
    path("api/books/", books),
    path("api/books/<int:book_id>/", book_detail),
    path("api/books/<int:book_id>/issue/", issue_book),
    path("api/books/<int:book_id>/return/", return_book),
    path("api/members/", members),
    path("api/members/create/", create_member),
    path("api/activity/", activity),
    path("api/stats/", stats),
    path("api/notifications/", notifications),
]
