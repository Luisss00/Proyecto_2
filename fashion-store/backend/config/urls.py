from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import CustomTokenObtainPairView, RegisterView

def api_root(request):
    return JsonResponse({
        'message': '🛍️ Fashion Store API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'auth': {
                'login': '/api/auth/login/',
                'register': '/api/auth/register/',
                'refresh': '/api/auth/refresh/',
            },
            'products': '/api/products/products/',
            'categories': '/api/products/categories/',
            'cart': '/api/cart/',
            'orders': '/api/orders/',
            'users': '/api/users/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),  # ← AGREGAR ESTA LÍNEA
    path('admin/', admin.site.urls),
    
    # Authentication
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    
    # Apps
    path('api/users/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/orders/', include('apps.orders.urls')),
]

# Always serve media files for this development setup
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)