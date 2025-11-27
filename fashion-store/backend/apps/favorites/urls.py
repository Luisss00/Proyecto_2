from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FavoriteViewSet

# Router para el ViewSet
router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorites')

urlpatterns = [
    # Las URLs se manejarán a través del router
    path('', include(router.urls)),
]