from django.core.management.base import BaseCommand
from apps.store.models import StoreConfiguration

class Command(BaseCommand):
    help = 'Inicializa la configuración por defecto de la tienda'

    def handle(self, *args, **options):
        # Crear configuración por defecto si no existe
        config, created = StoreConfiguration.objects.get_or_create(
            id=1,
            defaults={
                'store_name': 'Fashion Store',
                'store_email': 'info@fashionstore.com',
                'store_phone': '+57 300 123 4567',
                'store_address': 'Cienaga Magdalena, Colombia',
                'facebook_url': 'https://facebook.com/fashionstore',
                'instagram_url': 'https://instagram.com/fashionstore',
                'twitter_url': 'https://twitter.com/fashionstore',
                'enable_nequi': True,
                'enable_stripe': False,
                'enable_mercadopago': False,
                'enable_contra_entrega': True,
                'shipping_cost': 15000,
                'free_shipping_min': 100000,
                'tax_rate': 19,
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Configuración inicial creada exitosamente'))
        else:
            self.stdout.write(self.style.WARNING('La configuración ya existía'))