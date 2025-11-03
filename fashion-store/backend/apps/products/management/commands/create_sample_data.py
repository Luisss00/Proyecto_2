from django.core.management.base import BaseCommand
from apps.users.models import User
from apps.products.models import Category, Product
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Crear datos de prueba'

    def handle(self, *args, **kwargs):
        # Crear usuarios
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@fashionstore.com',
                'role': 'administrador',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin.set_password('Admin123!')
        admin.save()

        vendedor, _ = User.objects.get_or_create(
            username='vendedor1',
            defaults={
                'email': 'vendedor@fashionstore.com',
                'role': 'vendedor',
                'first_name': 'Juan',
                'last_name': 'Vendedor'
            }
        )
        vendedor.set_password('Vendedor123!')
        vendedor.save()

        cliente, _ = User.objects.get_or_create(
            username='cliente1',
            defaults={
                'email': 'cliente@fashionstore.com',
                'role': 'cliente',
                'first_name': 'María',
                'last_name': 'Cliente'
            }
        )
        cliente.set_password('Cliente123!')
        cliente.save()

        # Crear categorías
        categorias_data = [
            {'name': 'Camisetas', 'description': 'Camisetas casuales y deportivas'},
            {'name': 'Pantalones', 'description': 'Jeans, joggers y formales'},
            {'name': 'Vestidos', 'description': 'Vestidos para toda ocasión'},
            {'name': 'Chaquetas', 'description': 'Chaquetas y abrigos'},
            {'name': 'Zapatos', 'description': 'Calzado deportivo y casual'},
        ]

        for cat_data in categorias_data:
            Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'slug': slugify(cat_data['name']),
                    'description': cat_data['description']
                }
            )

        # Crear productos
        camisetas = Category.objects.get(name='Camisetas')
        productos = [
            {
                'name': 'Camiseta Básica Negra',
                'description': 'Camiseta 100% algodón, ajuste regular',
                'price': 35000,
                'discount_price': 28000,
                'stock': 50,
                'is_featured': True,
                'available_sizes': ['S', 'M', 'L', 'XL'],
                'colors': ['Negro', 'Blanco', 'Gris']
            },
            {
                'name': 'Camiseta Oversize Blanca',
                'description': 'Camiseta oversize de algodón premium',
                'price': 45000,
                'stock': 30,
                'is_featured': True,
                'available_sizes': ['M', 'L', 'XL'],
                'colors': ['Blanco', 'Beige']
            },
            {
                'name': 'Polo Clásico',
                'description': 'Polo con cuello y botones',
                'price': 55000,
                'discount_price': 44000,
                'stock': 25,
                'available_sizes': ['S', 'M', 'L'],
                'colors': ['Azul', 'Negro', 'Blanco']
            },
        ]

        for prod_data in productos:
            Product.objects.get_or_create(
                name=prod_data['name'],
                defaults={
                    'slug': slugify(prod_data['name']),
                    'description': prod_data['description'],
                    'price': prod_data['price'],
                    'discount_price': prod_data.get('discount_price'),
                    'category': camisetas,
                    'vendor': vendedor,
                    'stock': prod_data['stock'],
                    'available_sizes': prod_data['available_sizes'],
                    'colors': prod_data['colors'],
                    'is_featured': prod_data.get('is_featured', False)
                }
            )

        self.stdout.write(self.style.SUCCESS('¡Datos de prueba creados!'))
        self.stdout.write('Usuarios:')
        self.stdout.write('  admin / Admin123!')
        self.stdout.write('  vendedor1 / Vendedor123!')
        self.stdout.write('  cliente1 / Cliente123!')