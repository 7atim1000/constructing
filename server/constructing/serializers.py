from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Category, Unit, Product, Contacts, Project, Transaction, PaymentMethod
from django.db import transaction
from decimal import Decimal
from rest_framework.pagination import PageNumberPagination



# This serializer is only used to return user data.
class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(source='profile.image', read_only=True)
    # The source='profile.image' comes from the relationship between User and Profile
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'image', 'role']
    
#Register 
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    image = serializers.ImageField(
        write_only=True,
        required=False
    )

    role = serializers.ChoiceField(
        choices=['user', 'admin'],
        default='user'
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'image', 'role']
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Passwords do not match!')
        
        return data

    def create(self, validated_data):
        
        validated_data.pop('password2')

        # retrieve image and type from validated_data:
        # Notic use pop to accept image , type (extra fields)
        image = validated_data.pop('image', None)
        user_role = validated_data.pop('role', 'user')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )

        Profile.objects.create(
            user=user,
            image=image,
            role=user_role,
        )

        return user

# Category
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
            model = Category
            fields = ['id', 'name']

# Units
class UnitSerializer(serializers.ModelSerializer):
    class Meta:
            model = Unit
            fields = ['id', 'name']



# Product
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    unit_name = serializers.CharField(source='unit.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category',
            'category_name',
            'unit',
            'unit_name',
            'price',
            'quantity',   
        ]


# Create products serializer
class ProductCreateSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    unit_name = serializers.CharField(
        source="unit.name",
        read_only=True
    )

    class Meta:

        model = Product

        fields = [
            "name",
            "category",
            "category_name",
            "unit",
            "unit_name",
            "price",
            "quantity",
        ]

        extra_kwargs = {

            "name": {
                "required": True,
            },

            "category": {
                "required": True,
            },

            "unit": {
                "required": True,
            },

            "price": {
                "required": True,
            },

            "quantity": {
                "required": True,
            },

        }



# Contacts Serializer
class ContactsSerializer(serializers.ModelSerializer):

    contact_type = serializers.SerializerMethodField()

    class Meta:

        model = Contacts

        fields = [
            "id",
            "name",
            "address",
            "phone",
            "balance",
            "owner",
            "supplier",
            "company",
            "individual",
            "contact_type",
        ]

    def get_contact_type(self, obj):

        if obj.owner:
            return "owner"

        if obj.supplier:
            return "supplier"

        if obj.company:
            return "company"

        if obj.individual:
            return "individual"

        return None

#Pagination
class ContactsPagination(PageNumberPagination):

    page_size = 10

    page_size_query_param = "page_size"

    max_page_size = 100


# Create Contacts: 

# =========================================================
# CREATE CONTACT SERIALIZER
# =========================================================

class ContactsCreateSerializer(serializers.ModelSerializer):

    class Meta:

        model = Contacts

        fields = [
            "name",
            "address",
            "phone",
            "balance",
            "owner",
            "supplier",
            "company",
            "individual",
        ]

        extra_kwargs = {

            "name": {
                "required": True,
            },

            "address": {
                "required": True,
            },

            "phone": {
                "required": True,
            },

            "balance": {
                "required": False,
            },

            "owner": {
                "required": False,
            },

            "supplier": {
                "required": False,
            },

            "company": {
                "required": False,
            },

            "individual": {
                "required": False,
            },

        }

    # =====================================================
    # VALIDATION
    # =====================================================

    def validate(self, attrs):

        owner = attrs.get("owner", False)
        supplier = attrs.get("supplier", False)
        company = attrs.get("company", False)
        individual = attrs.get("individual", False)

        # -------------------------------------------------
        # At least one type must be selected
        # -------------------------------------------------

        if not any([
            owner,
            supplier,
            company,
            individual,
        ]):

            raise serializers.ValidationError({
                "contact_type": (
                    "يجب اختيار نوع جهة اتصال واحد على الأقل."
                )
            })

        return attrs


# =========================================================
# PROJECT OWNER SERIALIZER
# =========================================================

class ProjectOwnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Contacts

        fields = [
            "id",
            "name",
        ]


# =========================================================
# PROJECT SERIALIZER
# Used for fetching projects
# =========================================================

class ProjectSerializer(serializers.ModelSerializer):

    owner_name = serializers.CharField(
        source="owner.name",
        read_only=True
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True
    )

    class Meta:

        model = Project

        fields = [
            "id",
            "name",

            "owner",
            "owner_name",

            "location",
            "area",

            "status",
            "status_display",

            "cost",

            "started_date",
            "initial_delivery",
            "final_delivery",
        ]

        read_only_fields = [
            "id",
            "owner_name",
            "status_display",
        ]


# =========================================================
# CREATE PROJECT SERIALIZER
# =========================================================
# =========================================================
# PROJECT SERIALIZER
# Used for fetching/displaying projects
# =========================================================

class ProjectSerializer(serializers.ModelSerializer):

    owner_name = serializers.CharField(
        source="owner.name",
        read_only=True
    )

    class Meta:
        model = Project

        fields = [
            "id",
            "name",
            "owner",
            "owner_name",
            "location",
            "area",
            "status",
            "cost",
            "started_date",
            "initial_delivery",
            "final_delivery",
        ]

        read_only_fields = [
            "id",
            "owner_name",
        ]


# =========================================================
# CREATE PROJECT
# =========================================================

class ProjectCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project

        fields = [
            "id",
            "name",
            "owner",
            "location",
            "area",
            "status",
            "cost",
            "started_date",
            "initial_delivery",
            "final_delivery",
        ]

        read_only_fields = [
            "id",
        ]

    def validate(self, attrs):

        owner = attrs.get("owner")
        cost = attrs.get("cost", Decimal("0"))

        # -------------------------------------------------
        # OWNER
        # -------------------------------------------------

        if not owner:
            raise serializers.ValidationError({
                "owner": "يرجى اختيار المالك."
            })

        # -------------------------------------------------
        # COST
        # -------------------------------------------------

        if cost is None:
            cost = Decimal("0")

        if cost < 0:
            raise serializers.ValidationError({
                "cost": "لا يمكن أن تكون تكلفة المشروع سالبة."
            })

        # -------------------------------------------------
        # OWNER MUST BE OWNER
        # -------------------------------------------------

        if not owner.owner:
            raise serializers.ValidationError({
                "owner": "جهة الاتصال المحددة ليست مالكاً."
            })

        # -------------------------------------------------
        # DATES
        # -------------------------------------------------

        started_date = attrs.get("started_date")
        initial_delivery = attrs.get("initial_delivery")
        final_delivery = attrs.get("final_delivery")

        if (
            started_date
            and initial_delivery
            and initial_delivery < started_date
        ):
            raise serializers.ValidationError({
                "initial_delivery":
                    "تاريخ التسليم الأولي يجب أن يكون بعد تاريخ البدء."
            })

        if (
            initial_delivery
            and final_delivery
            and final_delivery < initial_delivery
        ):
            raise serializers.ValidationError({
                "final_delivery":
                    "تاريخ التسليم النهائي يجب أن يكون بعد تاريخ التسليم الأولي."
            })

        return attrs

    # =====================================================
    # CREATE + UPDATE OWNER BALANCE
    # =====================================================

    @transaction.atomic
    def create(self, validated_data):

        owner = validated_data["owner"]

        cost = validated_data.get(
            "cost",
            Decimal("0")
        )

        # -------------------------------------------------
        # CREATE PROJECT
        # -------------------------------------------------

        project = Project.objects.create(
            **validated_data
        )

        # -------------------------------------------------
        # ADD PROJECT COST TO OWNER BALANCE
        # -------------------------------------------------

        owner.balance = (
            owner.balance or Decimal("0")
        ) + cost

        owner.save(
            update_fields=["balance"]
        )

        return project


# =========================================================
# UPDATE PROJECT
# =========================================================

class ProjectUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project

        fields = [
            "id",
            "name",
            "owner",
            "location",
            "area",
            "status",
            "cost",
            "started_date",
            "initial_delivery",
            "final_delivery",
        ]

        read_only_fields = [
            "id",
        ]

    def validate(self, attrs):

        # -------------------------------------------------
        # GET CURRENT PROJECT
        # -------------------------------------------------

        project = self.instance

        # -------------------------------------------------
        # OWNER
        # -------------------------------------------------

        new_owner = attrs.get(
            "owner",
            project.owner
        )

        if not new_owner:
            raise serializers.ValidationError({
                "owner": "يرجى اختيار المالك."
            })

        # -------------------------------------------------
        # OWNER MUST BE OWNER
        # -------------------------------------------------

        if not new_owner.owner:
            raise serializers.ValidationError({
                "owner": "جهة الاتصال المحددة ليست مالكاً."
            })

        # -------------------------------------------------
        # COST
        # -------------------------------------------------

        new_cost = attrs.get(
            "cost",
            project.cost or Decimal("0")
        )

        if new_cost is None:
            new_cost = Decimal("0")

        if new_cost < 0:
            raise serializers.ValidationError({
                "cost": "لا يمكن أن تكون تكلفة المشروع سالبة."
            })

        # -------------------------------------------------
        # DATES
        # -------------------------------------------------

        started_date = attrs.get(
            "started_date",
            project.started_date
        )

        initial_delivery = attrs.get(
            "initial_delivery",
            project.initial_delivery
        )

        final_delivery = attrs.get(
            "final_delivery",
            project.final_delivery
        )

        # -------------------------------------------------
        # INITIAL DELIVERY DATE
        # -------------------------------------------------

        if (
            started_date
            and initial_delivery
            and initial_delivery < started_date
        ):
            raise serializers.ValidationError({
                "initial_delivery":
                    "تاريخ التسليم الأولي يجب أن يكون بعد تاريخ البدء."
            })

        # -------------------------------------------------
        # FINAL DELIVERY DATE
        # -------------------------------------------------

        if (
            initial_delivery
            and final_delivery
            and final_delivery < initial_delivery
        ):
            raise serializers.ValidationError({
                "final_delivery":
                    "تاريخ التسليم النهائي يجب أن يكون بعد تاريخ التسليم الأولي."
            })

        return attrs

    # =====================================================
    # UPDATE PROJECT + OWNER BALANCE
    # =====================================================

    @transaction.atomic
    def update(self, instance, validated_data):

        project = instance

        # -------------------------------------------------
        # OLD VALUES
        # -------------------------------------------------

        old_owner = project.owner

        old_cost = (
            project.cost
            or Decimal("0")
        )

        # -------------------------------------------------
        # NEW VALUES
        # -------------------------------------------------

        new_owner = validated_data.get(
            "owner",
            old_owner
        )

        new_cost = validated_data.get(
            "cost",
            old_cost
        )

        if new_cost is None:
            new_cost = Decimal("0")

        # =================================================
        # CASE 1
        # SAME OWNER
        # =================================================

        if old_owner.id == new_owner.id:

            difference = (
                new_cost - old_cost
            )

            if difference != 0:

                old_owner.balance = (
                    old_owner.balance
                    or Decimal("0")
                ) + difference

                old_owner.save(
                    update_fields=["balance"]
                )

        # =================================================
        # CASE 2
        # OWNER CHANGED
        # =================================================

        else:

            # ---------------------------------------------
            # REMOVE OLD PROJECT COST
            # FROM OLD OWNER
            # ---------------------------------------------

            old_owner.balance = (
                old_owner.balance
                or Decimal("0")
            ) - old_cost

            old_owner.save(
                update_fields=["balance"]
            )

            # ---------------------------------------------
            # ADD NEW PROJECT COST
            # TO NEW OWNER
            # ---------------------------------------------

            new_owner.balance = (
                new_owner.balance
                or Decimal("0")
            ) + new_cost

            new_owner.save(
                update_fields=["balance"]
            )

        # =================================================
        # UPDATE PROJECT
        # =================================================

        for attr, value in validated_data.items():

            setattr(
                project,
                attr,
                value
            )

        project.save()

        return project


# =========================================================
# PAYMENT METHOD SERIALIZER
# =========================================================

class PaymentMethodSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentMethod

        fields = [
            "id",
            "name",
        ]


# =========================================================
# TRANSACTION FETCH SERIALIZER
# =========================================================

class TransactionSerializer(serializers.ModelSerializer):

    transaction_user_name = serializers.SerializerMethodField()

    confirm_user_name = serializers.SerializerMethodField()

    payment_method_name = serializers.CharField(
        source="payment_method.name",
        read_only=True,
    )

    type_display = serializers.CharField(
        source="get_type_display",
        read_only=True,
    )

    class Meta:

        model = Transaction

        fields = [
            "id",
            "transaction_date",
            "type",
            "type_display",
            "amount",

            "payment_method",
            "payment_method_name",

            "statement",

            "person_reciept",
            "person_deliver",

            "transaction_user",
            "transaction_user_name",

            "checkpoint",

            "confirm_user",
            "confirm_user_name",
        ]

        read_only_fields = [
            "transaction_user",
            "confirm_user",
        ]

    def get_transaction_user_name(self, obj):

        if obj.transaction_user:
            return obj.transaction_user.get_full_name() or obj.transaction_user.username

        return None

    def get_confirm_user_name(self, obj):

        if obj.confirm_user:
            return obj.confirm_user.get_full_name() or obj.confirm_user.username

        return None


# =========================================================
# CREATE TRANSACTION
# =========================================================

class TransactionCreateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Transaction

        fields = [
            "transaction_date",
            "type",
            "amount",
            "payment_method",
            "statement",
            "person_reciept",
            "person_deliver",
        ]

        extra_kwargs = {

            "person_reciept": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },

            "person_deliver": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
        }

    def validate_amount(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "المبلغ لا يمكن أن يكون سالباً"
            )

        return value


# =========================================================
# UPDATE TRANSACTION
# =========================================================

class TransactionUpdateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Transaction

        fields = [
            "transaction_date",
            "type",
            "amount",
            "payment_method",
            "statement",
            "person_reciept",
            "person_deliver",
            "checkpoint",
        ]

        extra_kwargs = {

            "person_reciept": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },

            "person_deliver": {
                "required": False,
                "allow_blank": True,
                "allow_null": True,
            },
        }

    def validate_amount(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "المبلغ لا يمكن أن يكون سالباً"
            )

        return value



# Payment method Serializers (fetch and create)
class PaymentMethodSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentMethod

        fields = [
            "id",
            "name",
        ]

class PaymentMethodCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentMethod

        fields = [
            "name",
        ]

    def validate_name(self, value):

        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "يرجى إدخال اسم طريقة الدفع"
            )

        return value