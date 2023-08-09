from django.db import models


class Staff(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    date_of_joined = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.name
    

GENDER = (
    ("MALE", "MALE"),
    ("FEMALE", "FEMALE"),        
    ("OTHERS", "OTHERS"),
)

class Student(models.Model):
    name = models.CharField(max_length=100)
    admission_id = models.CharField(max_length=100, unique=True)
    gender = models.CharField(max_length=100, choices=GENDER)
    email = models.EmailField()
    phone = models.CharField(max_length=100)
    date_of_admission = models.DateField()
    cgpa = models.FloatField(default=0)
    no_of_backlog = models.IntegerField(default=0)
        
    def __str__(self):
        return f"{self.admission_id} - {self.name}"
    

class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100, unique=True)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.name} - {self.code}"
    

class Class(models.Model):
    sem = models.CharField(max_length=100)
    year = models.IntegerField()
    batch = models.CharField(max_length=100, null=True, blank=True)
    students = models.ManyToManyField(Student)
    subjects = models.ManyToManyField(Subject)
    #tutor = models.ForeignKey(Staff, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.sem} - {self.batch} - {self.year}"
    

class ClassSubject(models.Model):
    class_field = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.class_field.name} - {self.subject.name}"


class Result(models.Model):
    sem = models.CharField(max_length=100)
    year = models.IntegerField()
    batch = models.CharField(max_length=100, null=True, blank=True)
    exam_type = models.CharField(max_length=100)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    grade = models.CharField(max_length=100)
    backlog = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.student.name} - {self.subject.name} - {self.grade} - {self.backlog}"
