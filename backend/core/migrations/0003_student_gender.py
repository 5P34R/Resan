# Generated by Django 4.2.4 on 2023-08-03 07:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_class_branch_class_starting_year'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='gender',
            field=models.CharField(choices=[('MALE', 'MALE'), ('FEMALE', 'FEMALE'), ('OTHERS', 'OTHERS')], default='MALE', max_length=100),
            preserve_default=False,
        ),
    ]
