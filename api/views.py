from re import X
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer

from .models import Task
# Create your views here.
import io
import base64
import json
from django.core.files.base import ContentFile
from rest_framework.renderers import JSONRenderer
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework.parsers import JSONParser


def video(data):
	fh = open("./video.mp4", "wb")
	fh.write(base64.b64decode(data))
	fh.close()
	print("\n\nFile has been created\n\n")


def image(data):
	fh = open("./image.jpeg", "wb")
	fh.write(base64.b64decode(data))
	fh.close()
	print("\n\nFile has been created\n\n")
@api_view(['GET'])
def apiOverview(request):
	api_urls = {
		'List':'/task-list/',
		'Detail View':'/task-detail/<str:pk>/',
		'Create':'/task-create/',
		'Update':'/task-update/<str:pk>/',
		'Delete':'/task-delete/<str:pk>/',
		}

	return Response(api_urls)

@api_view(['GET'])
def taskList(request):
	tasks = Task.objects.all()
	serializer = TaskSerializer(tasks, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, pk):
	tasks = Task.objects.get(id=pk)
	serializer = TaskSerializer(tasks, many=False)
	return Response(serializer.data)


@api_view(['POST'])
def taskCreate(request):
	parsed = request.body.decode("utf-8") 
	print(parsed)
	dataLen = len(parsed) - 44
	data = parsed[113:dataLen]
	# print("len of string",len(data),data)
	image(data)
	return Response('got your image')
@api_view(['POST'])
def taskUpdate(request, pk):
	task = Task.objects.get(id=pk)
	serializer = TaskSerializer(instance=task, data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)


@api_view(['DELETE'])
def taskDelete(request, pk):
	task = Task.objects.get(id=pk)
	task.delete()

	return Response('Item succsesfully delete!')



