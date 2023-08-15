from django.urls import path

from .views import AddSemester, ResultAnalysis, ListStudents, PassRateView, ResultView, index, StudentDetailView, UploadView

urlpatterns = [
    path("", index, name="index"),
    path("student-list/", ListStudents.as_view(), name="student-list"),
    path("student-detail/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),
    path("upload/", UploadView.as_view(), name="upload"),
    
    path("add-sem/", AddSemester.as_view(), name="add-sem"),
    path("pass-rate/", PassRateView.as_view(), name="pass-rate"),
    path("result-details/", ResultView.as_view(), name="result-details"),
    path("result-analysis/", ResultAnalysis.as_view(), name="result-analysis")
]