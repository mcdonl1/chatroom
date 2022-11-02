from django.shortcuts import render
from .models import Chat
from django.core import serializers
from django.http import HttpResponse, HttpRequest
from django.utils import timezone
import json


def to_json(obj: any):
    return serializers.serialize("json", obj)

# Create your views here.
def chat(request: HttpRequest):
    if request.method == "GET":
        res_content = to_json(Chat.objects.all())
        return HttpResponse(content=res_content, content_type="text/json", status=200)
    elif request.method == "POST":
        new_chat = Chat()
        new_chat.date_created = timezone.now()
        new_chat.creator = request.user
        chat_name = json.loads(request.body).get("name")
        new_chat.name = chat_name if chat_name != None else "New Chat"
        return HttpResponse(
            content=to_json([new_chat])
        )


def new_chat(request: HttpRequest, name: str):
    new_chat = Chat()
    new_chat.date_created = timezone.now()
    chat_name = name
    new_chat.name = chat_name if chat_name != None else "New Chat"
    new_chat.creator = request.user
    new_chat.save()
    return HttpResponse(
        content=to_json([new_chat])
    )
