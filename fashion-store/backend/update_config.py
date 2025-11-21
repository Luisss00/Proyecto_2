#!/usr/bin/env python
import os
import django
import sys

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.store.models import StoreConfiguration

try:
    config = StoreConfiguration.objects.get(id=1)
    config.facebook_url = "https://facebook.com/fashionstore"
    config.instagram_url = "https://instagram.com/fashionstore"
    config.twitter_url = "https://twitter.com/fashionstore"
    config.save()
    
    print("Configuracion actualizada exitosamente")
    print(f"Facebook: {config.facebook_url}")
    print(f"Instagram: {config.instagram_url}")
    print(f"Twitter: {config.twitter_url}")
    
except Exception as e:
    print(f"Error: {e}")