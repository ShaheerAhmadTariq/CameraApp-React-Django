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
import numpy as np
import cv2
from django.core.files.base import ContentFile
from rest_framework.renderers import JSONRenderer
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from rest_framework.parsers import JSONParser


listOfImages = []

def video(data):
	fh = open("./video.mp4", "wb")
	fh.write(base64.b64decode(data))
	fh.close()
	print("\n\nFile has been created\n\n")


def image(img):
	decoded_data = base64.b64decode(img)
	np_data = np.frombuffer(decoded_data,np.uint8)
	img = cv2.imdecode(np_data,cv2.IMREAD_UNCHANGED)
	# img = cv2.imread('./img.jpg')
	face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	# Detect faces
	faces = face_cascade.detectMultiScale(gray, 1.1, 4)
	# Draw rectangle around the faces
	for (x, y, w, h) in faces:
		cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
	# im_bytes = img.tobytes()
	# im_b64 = base64.b64encode(im_bytes)
	# parsed = im_b64.decode('utf-8')
	img_encode = cv2.imencode('.jpeg', img)[1]
	img_encode.tobytes()
	baseImg=base64.b64encode(img_encode)
	img = baseImg.decode('utf-8')
	return img
	# fh = open("./image.jpeg", "wb")
	# fh.write(base64.b64decode(data))
	# fh.close()
	# print("\n\nFile has been created\n\n")
def countImages(data):
	listOfImages.append(data)
	print(len(listOfImages))
@api_view(['GET'])
def createVideo(request):
	frameSize = (640, 360)
	out = cv2.VideoWriter('output_video.avi',cv2.VideoWriter_fourcc(*'DIVX'), 60, frameSize)
	for val in listOfImages:
		img = cv2.imread(val)
		out.write
	out.release()
	return Response('Video Created')
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
	# print('parsed: ',parsed)
	firstHalf = parsed.split('base64,')
	secondHalf = firstHalf[1].split('------WebKit')
	data= secondHalf[0].strip()
	# dataLen = len(parsed) - 44
	# data = parsed[113:dataLen]
	# print("len of string",len(data),data)
	img = image(data)
	data = 'data:image/jpeg;base64,' + img
	
	# print(parsed)
	# dataLen = len(parsed) - 44
	# data = parsed[113:dataLen]
	# print("len of string",len(data),data)
	# print(data)
	
	return Response(data)
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



