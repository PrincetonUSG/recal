from tastypie.resources import ModelResource
from tastypie.cache import SimpleCache
from tastypie import fields
from course_selection.models import *

class SemesterResource(ModelResource):
    class Meta:
        queryset = Semester.objects.all()
        resource_name = 'semester'
        allowed_methods = ['get']

class CourseResource(ModelResource):
    semester = fields.ForeignKey(SemesterResource, 'semester')

    class Meta:
        queryset = Course.objects.all()
        resource_name = 'course'
        allowed_methods = ['get']
        cache = SimpleCache(timeout=10)

