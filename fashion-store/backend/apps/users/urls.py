from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserProfileView
from .views import change_password

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change_password/', change_password, name='change-password'),
    path('', include(router.urls)),
]