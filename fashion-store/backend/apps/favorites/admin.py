from django.contrib import admin
from .models import Favorite

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')
    list_filter = ('created_at', 'user', 'product__category')
    search_fields = ('user__username', 'product__name')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Información del Favorito', {
            'fields': ('user', 'product')
        }),
        ('Fecha', {
            'fields': ('created_at',)
        }),
    )