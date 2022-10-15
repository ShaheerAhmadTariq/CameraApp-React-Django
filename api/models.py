from turtle import title
from unittest.util import _MAX_LENGTH
from django.db import models

# Create your models here.

class Task(models.Model):
    title = models.CharField(max_length = 200)
    data = models.TextField(db_column='data',
            blank=True)
    def set_data(self, data):
      self._data = base64.encodestring(data)

    def get_data(self):
        return base64.decodestring(self._data)
#   description = "Blob"
#   def db_type(self, connection):
#         return 'blob'
      
#   def __str__(self):
#     return self.title



#   _data = models.TextField(
#             db_column='data',
#             blank=True)

#   def set_data(self, data):
#       self._data = base64.encodestring(data)

#   def get_data(self):
#       return base64.decodestring(self._data)

#   data = property(get_data, set_data)