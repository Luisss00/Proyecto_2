from django.urls import path
from . import views

urlpatterns = [
    path('config/', views.StoreConfigurationView.as_view(), name='store_config'),
    path('config/public/', views.get_public_config, name='store_config_public'),
]