# Migration manual para eliminar campo contact_status que existe en BD pero no en modelo
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_alter_order_subtotal_alter_order_total_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE orders DROP COLUMN contact_status;",
            reverse_sql="ALTER TABLE orders ADD COLUMN contact_status varchar(30) NOT NULL DEFAULT 'nuevo';",
        ),
    ]