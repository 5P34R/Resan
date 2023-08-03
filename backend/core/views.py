from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from core.serializers import BatchListSerializer, BatchStudentSerializer, ClassSerializer, StudentSerializer

from .models import Student, Class

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


class ListStudents(APIView):
    """
    List of all Students
    """
    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


class StudentDetailView(APIView):
    """
    Student Detail based on id
    """
    def get(self, request, pk):
        student = Student.objects.get(id=pk)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    
class BatchList(APIView):
    
    def get(self, request):
        batchs = Class.objects.all()
        serializer = BatchListSerializer(batchs, many=True)
        return Response(serializer.data)


class BatchStudent(APIView):
    
    def get(self, request, **kwargs):
        sem = request.GET.get("sem")
        batch = request.GET.get("batch")
        year = request.GET.get("year")
        
        if not sem or not batch or not year:
            return Response({"error": "Please provide all the details"})
        
        class_obj = Class.objects.filter(name=sem, batch=batch, starting_year=year).first()
        if not class_obj:
            return Response({"error": "No class found"})

        serializer = ClassSerializer(class_obj, many=False)
        return Response(serializer.data)


class BatchHigestCGPA(APIView):
    
    def get(self, request, **kwargs):
        sem = request.GET.get("sem")
        batch = request.GET.get("batch")
        year = request.GET.get("year")
        
        if not sem or not batch or not year:
            return Response({"error": "Please provide all the details"})
        
        class_obj = Class.objects.filter(name=sem, batch=batch, starting_year=year).first()
        if not class_obj:
            return Response({"error": "No class found"})
        
        class_students = class_obj.student.order_by("-cgpa")[:10]
        class_students = BatchStudentSerializer(class_students, many=True).data
        return Response(class_students)
