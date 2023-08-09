# Assuming you've already defined your models and imported them
from django.utils import timezone
import random
from core.models import Staff, Student, Subject, Class, Result

# Create staff members (tutors)
tutor1 = Staff.objects.create(name="Tutor 1", phone="1234567890", email="tutor1@example.com", date_of_joined=timezone.now())
tutor2 = Staff.objects.create(name="Tutor 2", phone="9876543210", email="tutor2@example.com", date_of_joined=timezone.now())
tutor3 = Staff.objects.create(name="Tutor 3", phone="5555555555", email="tutor3@example.com", date_of_joined=timezone.now())

# Create subjects
subject1 = Subject.objects.create(name="Mathematics", code="MAT101", staff=tutor1)
subject2 = Subject.objects.create(name="Physics", code="PHY201", staff=tutor2)
subject3 = Subject.objects.create(name="Computer Science", code="CS301", staff=tutor3)
subject4 = Subject.objects.create(name="Chemistry", code="CHE101", staff=tutor1)
subject5 = Subject.objects.create(name="Biology", code="BIO201", staff=tutor2)
subject6 = Subject.objects.create(name="History", code="HIS301", staff=tutor3)
# ... (create more subjects)

# Create students for Batch A
students_batch_a = []
for i in range(30):
    student = Student.objects.create(
        name=f"Student A{i+1}",
        admission_id=f"ADM-A{i+1}",
        gender="MALE" if i % 2 == 0 else "FEMALE",
        email=f"student_a{i+1}@example.com",
        phone="1234567890",
        date_of_admission=timezone.now(),
        department="Computer Science",
    )
    students_batch_a.append(student)

# Create students for Batch B
students_batch_b = []
for i in range(20):
    student = Student.objects.create(
        name=f"Student B{i+1}",
        admission_id=f"ADM-B{i+1}",
        gender="MALE" if i % 2 == 0 else "FEMALE",
        email=f"student_b{i+1}@example.com",
        phone="9876543210",
        date_of_admission=timezone.now(),
        department="Computer Science",
    )
    students_batch_b.append(student)

# Create classes and link subjects for both batches
class_batch_a = Class.objects.create(name="Semester 1", batch="A", starting_year=2023, tutor=tutor1)
class_batch_b = Class.objects.create(name="Semester 1", batch="B", starting_year=2023, tutor=tutor2)

class_batch_a.students.add(*students_batch_a)
class_batch_b.students.add(*students_batch_b)

class_batch_a.subjects.add(subject1, subject2, subject3, subject4, subject5, subject6)
class_batch_b.subjects.add(subject1, subject2, subject3, subject4, subject5, subject6)

# Simulate uploading results
grades = ["A", "B", "C", "D", "F"]
for student in students_batch_a + students_batch_b:
    student_class = class_batch_a if student in students_batch_a else class_batch_b
    for class_subject in student_class.subjects.all():
        Result.objects.create(
            student=student,
            subject=class_subject,
            grade=random.choice(grades),
            supply=random.choice([True, False])
        )

# Simulate promoting students to the next semester (S1 -> S2)
next_semester_mapping = {
    class_batch_a: class_batch_b,
    class_batch_b: None  # For the last semester
}

for current_class, next_class in next_semester_mapping.items():
    if next_class:
        next_class.students.add(*current_class.students.all())

print("Dummy data creation completed.")
