# Generated by Django 4.2.4 on 2023-08-03 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_student_completed_course'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='class',
            name='branch',
        ),
        migrations.AddField(
            model_name='student',
            name='branch',
            field=models.CharField(default='CS', max_length=100),
            preserve_default=False,
        ),
    ]
