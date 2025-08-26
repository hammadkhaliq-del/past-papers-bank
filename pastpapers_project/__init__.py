# File: pastpapers_project/__init__.py
# This file makes Python treat the directory as a package

# File: pastpapers_app/__init__.py
# This file makes Python treat the directory as a package

# File: pastpapers_app/apps.py
from django.apps import AppConfig

class PastpapersAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pastpapers_app'
    verbose_name = 'Past Papers Bank'