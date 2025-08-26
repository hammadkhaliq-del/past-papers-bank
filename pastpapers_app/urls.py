# File: pastpapers_app/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('download/<int:paper_id>/', views.download_paper, name='download_paper'),
    path('api/subjects/', views.get_subjects_api, name='subjects_api'),
    path('upload/', views.upload_paper, name='upload_paper'),
]