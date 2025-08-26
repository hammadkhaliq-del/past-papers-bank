# File: pastpapers_app/views.py

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404, JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.shortcuts import redirect
from .models import Subject, Paper
import os
import mimetypes

def index(request):
    subjects = Subject.objects.prefetch_related('papers').all()
    
    # Organize papers by subject, term, and year
    subjects_data = []
    for subject in subjects:
        papers_by_term = {
            'Mid': [],
            'Final': []
        }
        
        for paper in subject.papers.all():
            papers_by_term[paper.term].append(paper)
        
        # Group by year within each term
        for term in papers_by_term:
            papers_by_year = {}
            for paper in papers_by_term[term]:
                if paper.year not in papers_by_year:
                    papers_by_year[paper.year] = []
                papers_by_year[paper.year].append(paper)
            papers_by_term[term] = papers_by_year
        
        subjects_data.append({
            'subject': subject,
            'papers': papers_by_term
        })
    
    context = {
        'subjects_data': subjects_data,
    }
    
    return render(request, 'index.html', context)

def download_paper(request, paper_id):
    paper = get_object_or_404(Paper, id=paper_id)
    
    if not paper.file:
        raise Http404("File not found")
    
    file_path = paper.file.path
    if not os.path.exists(file_path):
        raise Http404("File not found on server")
    
    # Determine content type
    content_type, encoding = mimetypes.guess_type(file_path)
    if content_type is None:
        content_type = 'application/octet-stream'
    
    # Create response
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{paper.filename}"'
        response['Content-Length'] = str(os.path.getsize(file_path))
        return response

def get_subjects_api(request):
    """API endpoint to get all subjects with their papers (for AJAX if needed)"""
    subjects = Subject.objects.prefetch_related('papers').all()
    
    data = []
    for subject in subjects:
        papers_data = []
        for paper in subject.papers.all():
            papers_data.append({
                'id': paper.id,
                'year': paper.year,
                'term': paper.term,
                'format': paper.format,
                'filename': paper.filename,
                'file_size': paper.get_file_size_display(),
                'download_url': f'/download/{paper.id}/'
            })
        
        data.append({
            'id': subject.id,
            'name': subject.name,
            'papers': papers_data
        })
    
    return JsonResponse({'subjects': data})

@staff_member_required
def upload_paper(request):
    """Simple upload view for staff members"""
    if request.method == 'POST':
        subject_id = request.POST.get('subject')
        year = request.POST.get('year')
        term = request.POST.get('term')
        format_type = request.POST.get('format')
        file = request.FILES.get('file')
        
        if all([subject_id, year, term, format_type, file]):
            try:
                subject = Subject.objects.get(id=subject_id)
                paper = Paper.objects.create(
                    subject=subject,
                    year=int(year),
                    term=term,
                    format=format_type,
                    file=file
                )
                messages.success(request, f'Paper uploaded successfully: {paper}')
            except Exception as e:
                messages.error(request, f'Error uploading paper: {str(e)}')
        else:
            messages.error(request, 'Please fill all required fields')
        
        return redirect('upload_paper')
    
    subjects = Subject.objects.all()
    context = {
        'subjects': subjects,
        'TERM_CHOICES': Paper.TERM_CHOICES,
        'FORMAT_CHOICES': Paper.FORMAT_CHOICES,
    }
    
    return render(request, 'upload.html', context)