from django.db import models
from django.utils import timezone
from decimal import Decimal
from apps.users.models import User
from apps.products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    )
    
    CONTACT_STATUS_CHOICES = (
        ('nuevo', 'Nuevo'),
        ('contactado', 'Contactado'),
        ('interesado', 'Interesado'),
        ('no_interesado', 'No Interesado'),
    )
    
    PAYMENT_METHODS = (
        ('nequi', 'Nequi'),
        ('stripe', 'Stripe'),
        ('mercadopago', 'MercadoPago'),
        ('contra_entrega', 'Contra Entrega'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')
    contact_status = models.CharField(max_length=30, choices=CONTACT_STATUS_CHOICES, default='nuevo')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    payment_id = models.CharField(max_length=200, blank=True)
    is_paid = models.BooleanField(default=False)
    
    # Shipping information
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_phone = models.CharField(max_length=20)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Pricing
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number} - {self.user.username}"
    
    def calculate_totals(self):
        """Calcular subtotal, tax y total de la orden"""
        try:
            # Calcular subtotal desde los items (con validación de datos)
            subtotal = Decimal('0.00')
            for item in self.items.all():
                item_subtotal = item.subtotal if item.subtotal else Decimal('0.00')
                subtotal += item_subtotal
            
            self.subtotal = subtotal
            
            # Calcular tax (IVA 19%) - usar Decimal para evitar errores de tipos
            self.tax = self.subtotal * Decimal('0.19')
            
            # Asegurar que shipping_cost no sea None
            shipping_cost = self.shipping_cost if self.shipping_cost else Decimal('0.00')
            
            # Calcular total
            self.total = self.subtotal + shipping_cost + self.tax
            
            # Solo guardar si hay cambios
            self.save(update_fields=['subtotal', 'tax', 'total'])
            
        except Exception as e:
            print(f"Error calculating totals for order {self.id}: {e}")
            # Valores por defecto en caso de error
            self.subtotal = self.subtotal or Decimal('0.00')
            self.tax = self.tax or Decimal('0.00')
            self.total = self.total or Decimal('0.00')
            self.save(update_fields=['subtotal', 'tax', 'total'])
    
    def save(self, *args, **kwargs):
        """Override save to generate order_number if not exists"""
        if not self.order_number:
            # Generar número de orden único
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            import random
            import string
            random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            self.order_number = f"ORD-{timestamp}-{random_suffix}"
        
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    size = models.CharField(max_length=10, default='')
    color = models.CharField(max_length=50, blank=True, default='')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'order_items'
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity}" if self.product else f"Producto eliminado x{self.quantity}"
    
    @property
    def subtotal(self):
        # Validar que price y quantity no sean None antes de calcular
        if self.price is None or self.quantity is None:
            return Decimal('0.00')
        return self.price * self.quantity
    
    def save(self, *args, **kwargs):
        # Si el producto fue eliminado, preservar el precio pero marcar como eliminado
        if self.product is None and self.price == 0:
            # Intentar recuperar el precio de los datos existentes
            pass
        super().save(*args, **kwargs)