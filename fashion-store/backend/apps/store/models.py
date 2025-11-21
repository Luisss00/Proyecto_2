from django.db import models

class StoreConfiguration(models.Model):
    """
    Modelo para almacenar la configuración de la tienda
    """
    store_name = models.CharField(max_length=255, default='Fashion Store')
    store_email = models.EmailField(default='info@fashionstore.com')
    store_phone = models.CharField(max_length=50, default='+57 300 123 4567')
    store_address = models.TextField(default='Cienaga Magdalena, Colombia')
    
    # Redes Sociales
    facebook_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    
    # Métodos de pago
    enable_nequi = models.BooleanField(default=True)
    enable_stripe = models.BooleanField(default=False)
    enable_mercadopago = models.BooleanField(default=False)
    enable_contra_entrega = models.BooleanField(default=True)
    
    # Configuración de envíos e impuestos
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=15000)
    free_shipping_min = models.DecimalField(max_digits=10, decimal_places=2, default=100000)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=19)
    
    # Logo de la tienda
    logo = models.ImageField(upload_to='store_logos/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Configuración de Tienda'
        verbose_name_plural = 'Configuraciones de Tienda'
    
    def __str__(self):
        return f"Configuración de {self.store_name}"
    
    @classmethod
    def get_singleton(cls):
        """
        Retorna la única instancia de configuración (Singleton pattern)
        """
        obj, created = cls.objects.get_or_create(id=1)
        return obj