# File: pastpapers_app/models.py

from django.db import models
import os

class Subject(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Paper(models.Model):
    TERM_CHOICES = [
        ('Mid', 'Mid'),
        ('Final', 'Final'),
    ]
    
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('img', 'Image'),
    ]
    
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='papers')
    year = models.IntegerField()
    term = models.CharField(max_length=5, choices=TERM_CHOICES)
    format = models.CharField(max_length=3, choices=FORMAT_CHOICES)
    file = models.FileField(upload_to='papers/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-year', 'term']
        unique_together = ['subject', 'year', 'term']
    
    def __str__(self):
        return f"{self.subject.name} - {self.year} {self.term}"
    
    @property
    def filename(self):
        return os.path.basename(self.file.name)
    
    @property
    def file_size(self):
        try:
            return self.file.size
        except:
            return 0
    
    def get_file_size_display(self):
        size = self.file_size
        if size < 1024:
            return f"{size} B"
        elif size < 1024 * 1024:
            return f"{size / 1024:.1f} KB"
        else:
            return f"{size / (1024 * 1024):.1f} MB"