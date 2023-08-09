from django.urls import path

from .views import AddSemester, BatchHigestCGPA, BatchList, ListStudents, PassRateView, index, StudentDetailView, BatchStudent, UploadView

urlpatterns = [
    path("", index, name="index"),
    path("student-list/", ListStudents.as_view(), name="student-list"),
    path("student-detail/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),
    path("batch-list/", BatchList.as_view(), name="batch-list"),
    path("batch-highcgpa/", BatchHigestCGPA.as_view(), name="branch-cgpa"),
    path("batch-details/", BatchStudent.as_view(), name="branch-students"),
    path("upload/", UploadView.as_view(), name="upload"),
    
    path("add-sem/", AddSemester.as_view(), name="add-sem"),
    path("pass-rate/", PassRateView.as_view(), name="pass-rate"),

]