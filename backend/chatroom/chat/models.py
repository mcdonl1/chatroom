from django.db import models
from django.contrib.auth.models import User


class Chat(models.Model):
    name = models.CharField(max_length=30)
    date_created = models.DateTimeField()
    # endpoint_adr = ? TODO add rel to chat endpoint
    creator = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['date_created']