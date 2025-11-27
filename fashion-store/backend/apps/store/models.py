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
    
    # Banner de la tienda
    BANNER_TYPES = [
        ('color', 'Color de Fondo'),
        ('image', 'Imagen Personalizada'),
    ]
    
    banner_type = models.CharField(
        max_length=10, 
        choices=BANNER_TYPES, 
        default='color'
    )
    banner_color = models.CharField(
        max_length=7, 
        default='#3B82F6',
        help_text='Código de color hexadecimal (ej: #3B82F6)'
    )
    banner_image = models.ImageField(
        upload_to='store_banners/', 
        blank=True, 
        null=True,
        help_text='Imagen para el banner (máx 5MB)'
    )
    
    # Configuración del texto del banner
    banner_title_text = models.CharField(
        max_length=255,
        default='Bienvenido a Fashion Store',
        help_text='Texto principal del banner'
    )
    banner_subtitle_text = models.CharField(
        max_length=255,
        default='Las mejores tendencias en moda al mejor precio',
        help_text='Texto secundario del banner'
    )
    banner_text_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Color del texto del banner (código hexadecimal)'
    )
    
    # Configuración de botones del banner
    enable_products_button = models.BooleanField(
        default=True,
        help_text='Mostrar botón de Ver Productos'
    )
    enable_offers_button = models.BooleanField(
        default=True,
        help_text='Mostrar botón de Ver Ofertas'
    )
    
    # Configuración del footer
    footer_background_color = models.CharField(
        max_length=7,
        default='#1F2937',
        help_text='Color de fondo del footer (código hexadecimal)'
    )
    footer_text_color = models.CharField(
        max_length=7,
        default='#D1D5DB',
        help_text='Color del texto del footer (código hexadecimal)'
    )
    footer_title_color = models.CharField(
        max_length=7,
        default='#FFFFFF',
        help_text='Color de los títulos del footer (código hexadecimal)'
    )
    
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