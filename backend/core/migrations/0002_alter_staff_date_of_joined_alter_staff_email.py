# Generated by Django 4.2.4 on 2023-08-09 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff',
            name='date_of_joined',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='staff',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]