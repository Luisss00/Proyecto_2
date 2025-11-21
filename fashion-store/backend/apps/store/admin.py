from django.contrib import admin
from .models import StoreConfiguration

@admin.register(StoreConfiguration)
class StoreConfigurationAdmin(admin.ModelAdmin):
    """
    Admin para la configuración de la tienda
    """
    list_display = (
        'store_name', 
        'store_email', 
        'store_phone',
        'created_at', 
        'updated_at'
    )
    list_editable = (
        'store_email',
        'store_phone',
    )
    fieldsets = (
        ('Información General', {
            'fields': ('store_name', 'store_email', 'store_phone', 'store_address', 'logo')
        }),
        ('Redes Sociales', {
            'fields': ('facebook_url', 'instagram_url', 'twitter_url'),
            'classes': ('collapse',)
        }),
        ('Métodos de Pago', {
            'fields': ('enable_nequi', 'enable_stripe', 'enable_mercadopago', 'enable_contra_entrega'),
            'classes': ('collapse',)
        }),
        ('Configuración de Envíos', {
            'fields': ('shipping_cost', 'free_shipping_min', 'tax_rate'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def has_add_permission(self, request):
        """Solo permitir agregar si no existe configuración"""
        return StoreConfiguration.objects.count() == 0
    
    def has_delete_permission(self, request, obj=None):
        """No permitir eliminar la configuración"""
        return False