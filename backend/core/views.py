from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from core.serializers import ResultSerializer, StudentSerializer
from rest_framework.parsers import MultiPartParser
from django.db.models import Count, F, Q
from rest_framework import status

from .models import Result, Staff, Student, Class, Subject
import pandas as pd

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

class UploadView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request):
        file = request.data.get('file')
        sem = request.data.get('sem')
        year = request.data.get('year')
        exam_type = request.data.get('exam_type')
        if not file or not sem or not year or not exam_type:
            return Response({"error": "Please provide all required data"})

        try:
            df = pd.read_excel(file, skiprows=[0])
            df.columns = df.columns.str.strip()

            # Batch Existence Check
            batch = Class.objects.filter(sem=sem, year=year).first()
            if not batch:
                return Response({"error": "Batch not found"})

            result_list = []
            for index, row in df.iterrows():
                row_data = row.to_dict()
                student_id = row_data["Student"].split("-")[0].strip()
                student = Student.objects.filter(admission_id=student_id).first()

                if student:
                    # Exam Result Creation
                    subject_codes = [col.strip() for col in row_data.keys() if col not in ["Student", "SGPA", "CGPA"]]
                    existing_subjects = Subject.objects.filter(code__in=subject_codes)
                    if existing_subjects:
                        for subject in existing_subjects:
                            res = Result(
                                sem=sem,
                                year=year,
                                batch=batch.batch,
                                exam_type=exam_type,
                                student=student,
                                subject=subject,
                                grade=row_data[subject.code],
                                backlog=row_data[subject.code] == "F"
                            )
                            result_list.append(res)

                    student.cgpa = row_data["CGPA"]
                    student.save()

            Result.objects.bulk_create(result_list)
            return Response({"message": "Subjects checked successfully", "success": True}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response({"error": str(e)})

    
class AddSemester(APIView):
    """
    Its a data uploading view. It will create students, subjects and class for a semester.
    it will take following data:
    1. Semester
    2. Batch
    3. Year
    4. Students
    5. Subjects
    """
    parser_classes = (MultiPartParser,)
    
    def post(self, request):
        sem = request.data.get("sem")
        batch = request.data.get("batch")
        year = request.data.get("year")
        
        if not sem or not batch or not year:
            return Response({"error": "Please provide all the details"})
        
        studentsreq = request.data.get("students")
        student_list = pd.read_excel(studentsreq)
        student_list.columns = student_list.columns.str.strip()
        
        students_to_create = []
        for index, row in student_list.iterrows():
            row = row.to_dict()
            student = Student(
                name=row["Name"],
                admission_id=row["Admission"],
                gender=row["gender"],
                email=row["email"],
                phone=row["phone"],
                date_of_admission=row["date_of_admission"]
            )
            students_to_create.append(student)
        
        Student.objects.bulk_create(students_to_create)

        subjectsreq = request.data.get("subjects")
        subject_list = pd.read_excel(subjectsreq)
        subject_list.columns = subject_list.columns.str.strip()
        
        subjects_to_create = []
        for index, row in subject_list.iterrows():
            row = row.to_dict()
            staff = Staff.objects.create(
                name=row["TutorName"],
                phone=row["Tutorphone"]
            )
            subject = Subject(
                name=row["Subject Name"],
                code=row["Subject Code"].strip(),
                staff=staff
            )
            subjects_to_create.append(subject)
        
        Subject.objects.bulk_create(subjects_to_create)
        
        class_obj, _ = Class.objects.get_or_create(sem=sem, batch=batch, year=year)
        class_obj.students.add(*students_to_create)
        class_obj.subjects.add(*subjects_to_create)
        class_obj.save()
        return Response({"message": "Students and subjects created successfully", "status":"success"}, status=status.HTTP_201_CREATED)


class PassRateView(APIView):
    def get(self, request):
        sem = request.query_params.get('sem')
        year = request.query_params.get('year')
        batch = request.query_params.get('batch')
        
        if not sem or not year or not batch:
            return Response({"error": "Please provide semester, year, and batch"})
        
        passed_grades = ['A', 'B', 'C', 'D', 'P', "A+", "B+", "C+", "D+"]  # Defining pass grades here
        
        subjects_pass_counts = Subject.objects.annotate(
            pass_count=Count('result', filter=Q(result__grade__in=pass_grades, result__sem=sem, result__year=year, result__batch=batch))
        ).order_by('-pass_count')
        
        subject_names_pass_counts = [
            {"subject": subject.name, "pass_count": subject.pass_count}
            for subject in subjects_pass_counts
        ]
        
        return Response(subject_names_pass_counts)
    
class ResultView(APIView):
    
    def get(self, request):
        sem = request.query_params.get('sem')
        year = request.query_params.get('year')
        batch = request.query_params.get('batch')
        
        if not sem or not year or not batch:
            return Response({"error": "Please provide semester, year, and batch"})
        
        results = Result.objects.filter(sem=sem, year=year, batch=batch)
        serializer = ResultSerializer(results, many=True)
        return Response(serializer.data)
        # breakpoint()
        
class ResultAnalysis(APIView):
    def get(self, request):
        sem = request.query_params.get('sem')
        year = request.query_params.get('year')
        batch = request.query_params.get('batch')
        
        if not sem or not year or not batch:
            return Response({"error": "Please provide semester, year, and batch"})
        
        passed_grades = ['A', 'B', 'C', 'D', 'P', "A+", "B+", "C+", "D+"]  # Define your pass grades here
        
        results = Result.objects.filter(sem=sem, year=year, batch=batch)
        
        if not results.exists():
            return Response({"error": "No results found"})
        students = Student.objects.filter(result__in=results).distinct()
        
        female_data = []
        male_data = []
        for student in students:
            total_passed = results.filter(student=student, grade__in=passed_grades).count()
            total_failed = results.filter(student=student, grade='F').count()
            gender = student.gender
            if gender == 'F':
                student_data = {
                    "student_name": student.name,
                    "gender": gender,
                    "total_passed": total_passed,
                    "total_failed": total_failed
                }
                female_data.append(student_data)
            else:
                student_data = {
                    "student_name": student.name,
                    "gender": gender,
                    "total_passed": total_passed,
                    "total_failed": total_failed
                }
                male_data.append(student_data)
                
        
        subjects_pass_counts = Subject.objects.annotate(
            pass_count=Count('result', filter=Q(result__grade__in=passed_grades, result__sem=sem, result__year=year, result__batch=batch))
        ).order_by('-pass_count')
        
        subject_names_pass_counts = [
            {"subject": subject.name, "pass_count": subject.pass_count, "subject_code": subject.code, "staff_name": subject.staff.name}
            for subject in subjects_pass_counts
        ]
        top_students = students.order_by('-cgpa')[:5]  
        top_cgpa_students = StudentSerializer(top_students, many=True).data

        return Response({
            "total_student": students.count(),
            "female_data":female_data,
            "male_data":male_data,
            "subject_names_pass_counts":subject_names_pass_counts,
            "top_cgpa":top_cgpa_students
        })