from rest_framework.serializers import ModelSerializer

from core.models import Staff, Student, Subject, Class, ClassSubject


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
    subject = SubjectSerializer(many=True, read_only=True)
    class Meta:
        model = Student
        fields = ['id', 'name', 'admission_id', 'gender', 'phone', 'email', 'cgpa']
        

class BatchListSerializer(ModelSerializer):
    class Meta:
        model = Class
        fields = ['name', 'batch', 'starting_year']

class ClassSubjectSerializer(ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    class Meta:
        model = ClassSubject
        fields = ['subject']

class ClassSerializer(ModelSerializer):
   
    subjects = SubjectSerializer(many=True, read_only=True)
    class Meta:
        model = Class
        fields = ['name', 'batch', 'starting_year', 'student', 'subjects']
        

