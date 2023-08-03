from django.contrib import admin

# Register your models here.
from .models import Class, Result, Staff, Student, Subject

admin.site.register(Staff)
admin.site.register(Subject)
admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Result)
