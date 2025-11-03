from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.users.models import User
from .models import Cart

@receiver(post_save, sender=User)
def create_user_cart(sender, instance, created, **kwargs):
    """Crear carrito automáticamente cuando se crea un usuario"""
    if created:
        Cart.objects.create(user=instance)