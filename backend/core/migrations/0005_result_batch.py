# Generated by Django 4.2.4 on 2023-08-09 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_result_sem'),
    ]

    operations = [
        migrations.AddField(
            model_name='result',
            name='batch',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
