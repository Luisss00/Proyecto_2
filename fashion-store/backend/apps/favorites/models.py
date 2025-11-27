from django.db import models
from django.contrib.auth import get_user_model
from apps.products.models import Product

User = get_user_model()

class Favorite(models.Model):
    """
    Modelo para manejar los productos favoritos de los usuarios
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'favorites'
        unique_together = ('user', 'product')  # Un usuario no puede tener el mismo producto como favorito dos veces
        ordering = ['-created_at']
        verbose_name = 'Producto Favorito'
        verbose_name_plural = 'Productos Favoritos'
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name}"