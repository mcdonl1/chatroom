from django.urls import path
from . import views

urlpatterns = [
    path('chats/<str:name>', views.new_chat),
    path('chats/', views.chat),
]
