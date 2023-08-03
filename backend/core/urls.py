from django.urls import path

from .views import BatchHigestCGPA, BatchList, ListStudents, index, StudentDetailView, BatchStudent

urlpatterns = [
    path("", index, name="index"),
    path("student-list/", ListStudents.as_view(), name="student-list"),
    path("student-detail/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),
    path("batch-list/", BatchList.as_view(), name="batch-list"),
    path("batch-highcgpa/", BatchHigestCGPA.as_view(), name="branch-cgpa"),
    path("batch-details/", BatchStudent.as_view(), name="branch-students")

]