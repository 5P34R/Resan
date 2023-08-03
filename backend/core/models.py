from django.db import models


class Staff(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    email = models.EmailField()
    date_of_joined = models.DateField()
    
    
    def __str__(self) -> str:
        return f"{self.name}"
    
class Subject(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    
    
    def __str__(self) -> str:
        return f"{self.name}"


GENDER = (
    ("MALE", "MALE"),
    ("FEMALE", "FEMALE"),
    ("OTHERS", "OTHERS"),
)

class Student(models.Model):
    name = models.CharField(max_length=100)
    adminision_id = models.CharField(max_length=100)
    gender = models.CharField(max_length=100, choices=GENDER)
    email = models.EmailField()
    phone = models.CharField(max_length=100)
    date_of_admission = models.DateField()
    dept = models.CharField(max_length=100)
    subject = models.ManyToManyField(Subject)
    cgpa = models.FloatField()
    no_of_supply = models.IntegerField()
    completed_course = models.BooleanField(default=False)
    
    
    def __str__(self) -> str:
        return f"{self.name}"

class Class(models.Model):
    name = models.CharField(max_length=100)
    batch = models.CharField(max_length=100, null=True, blank=True)
    starting_year = models.IntegerField(default=2021)
    student = models.ManyToManyField(Student)
    subject = models.ManyToManyField(Subject)
    tutor = models.OneToOneField(Staff, on_delete=models.CASCADE)
    def __str__(self) -> str:
        return f"{self.name} - {self.batch} - {self.starting_year}"

class Result(models.Model):
    name = models.CharField(max_length=100)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    marks = models.FloatField()
    grade = models.CharField(max_length=100)
    supply = models.BooleanField(default=False)
    
    def __str__(self) -> str:
        return f"{self.student.name} - {self.subject.name} - {self.marks} - {self.grade} - {self.supply}"