from rest_framework.serializers import ModelSerializer

from core.models import Result, Staff, Student, Subject, Class, ClassSubject


class StaffSerializer(ModelSerializer):
    
    class Meta:
        model = Staff
        fields = ['name', 'phone', 'email', 'date_of_joined']

class SubjectSerializer(ModelSerializer):
    staff = StaffSerializer(read_only=True)
    class Meta:
        model = Subject
        fields = ['name', 'code', 'staff']
        
class BatchStudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = ['name', 'adminision_id', 'gender', 'phone', 'email', 'no_of_supply', 'cgpa']

class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'admission_id', 'gender', 'phone', 'email', 'cgpa', 'no_of_backlog']
        


class ClassSerializer(ModelSerializer):
   
    subjects = SubjectSerializer(many=True, read_only=True)
    class Meta:
        model = Class
        fields = ['name', 'batch', 'year', 'students', 'subjects']
        



class ResultSerializer(ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    class Meta:
        model = Result
        fields = ['sem', 'batch', 'year', 'exam_type', 'student', 'subject', 'grade', 'backlog']