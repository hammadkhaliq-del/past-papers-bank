# File: pastpapers_app/admin.py

from django.contrib import admin
from .models import Subject, Paper

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'paper_count']
    search_fields = ['name']
    ordering = ['name']
    
    def paper_count(self, obj):
        return obj.papers.count()
    paper_count.short_description = 'Number of Papers'

@admin.register(Paper)
class PaperAdmin(admin.ModelAdmin):
    list_display = ['subject', 'year', 'term', 'format', 'filename', 'file_size_display', 'uploaded_at']
    list_filter = ['subject', 'year', 'term', 'format', 'uploaded_at']
    search_fields = ['subject__name']
    ordering = ['-year', 'subject__name', 'term']
    list_per_page = 50
    
    def filename(self, obj):
        return obj.filename
    filename.short_description = 'File Name'
    
    def file_size_display(self, obj):
        return obj.get_file_size_display()
    file_size_display.short_description = 'File Size'
    
    fieldsets = (
        ('Paper Information', {
            'fields': ('subject', 'year', 'term', 'format')
        }),
        ('File Upload', {
            'fields': ('file',)
        }),
    )

# Customize admin site header
admin.site.site_header = "Past Papers Bank Administration"
admin.site.site_title = "Past Papers Admin"
admin.site.index_title = "Welcome to Past Papers Bank Admin Panel"
