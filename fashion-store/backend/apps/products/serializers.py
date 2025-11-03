from rest_framework import serializers
from .models import Category, Product, ProductImage, Review
from apps.users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 
                  'is_active', 'products_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'order']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    primary_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'price', 'discount_price', 
                  'final_price', 'has_discount', 'category_name', 
                  'primary_image', 'stock', 'is_featured']
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    vendor = UserSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 
                  'discount_price', 'final_price', 'has_discount', 
                  'category', 'vendor', 'stock', 'available_sizes', 
                  'colors', 'is_featured', 'is_active', 'images', 
                  'reviews', 'average_rating', 'reviews_count', 
                  'views_count', 'created_at']
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum(r.rating for r in reviews) / len(reviews)
        return 0
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'slug', 'description', 'price', 'discount_price',
                  'category', 'stock', 'available_sizes', 'colors', 
                  'is_featured', 'is_active']
    
    def create(self, validated_data):
        validated_data['vendor'] = self.context['request'].user
        return super().create(validated_data)