# Generated by Django 4.2.4 on 2023-08-03 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_student_gender'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='cgpa',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
    ]
