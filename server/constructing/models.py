from django.db import models
from django.contrib.auth.models import User




# =========================================================
# AUTHENTICATION
# =========================================================

class Profile(models.Model):

    USER = "user"
    ADMIN = "admin"

    ROLE_CHOICES = [
        (USER, "User"),
        (ADMIN, "Admin"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    image = models.ImageField(
        upload_to="profiles/",
        null=True,
        blank=True
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=USER
    )

    def __str__(self):
        return self.user.username


# =========================================================
# CATEGORY
# =========================================================

class Category(models.Model):

    name = models.CharField(
        max_length=100
    )

    def __str__(self):
        return self.name


# =========================================================
# UNIT
# =========================================================

class Unit(models.Model):

    name = models.CharField(
        max_length=100
    )

    def __str__(self):
        return self.name


# =========================================================
# PRODUCT
# =========================================================

class Product(models.Model):

    name = models.CharField(
        max_length=100
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products"
    )

    unit = models.ForeignKey(
        Unit,
        on_delete=models.CASCADE,
        related_name="products"
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return self.name


# =========================================================
# CONTACTS
# =========================================================

class Contacts(models.Model):

    name = models.CharField(
        max_length=100
    )

    address = models.CharField(
        max_length=100
    )

    phone = models.CharField(
        max_length=100
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    owner = models.BooleanField(
        default=False
    )

    supplier = models.BooleanField(
        default=False
    )

    company = models.BooleanField(
        default=False
    )

    individual = models.BooleanField(
        default=False
    )

    def __str__(self):
        return self.name

# =========================================================
# PROJECTS
# =========================================================
class Project(models.Model):

    PREPARATION = "preparation"
    STARTED = "started"
    CONSTRUCTION = "construction"
    INITIAL_DELIVERY = "initial-delivery"
    FINAL_DELIVERY = "final-delivery"
    
    STATUS_CHOICES = [
        (
            PREPARATION,
            "preparation",
        ),
        (
            STARTED,
            "started",
        ),
        (
            CONSTRUCTION,
            "construction",
        ),
        (
            INITIAL_DELIVERY,
            "initial-delivery",
        ),
        (
            FINAL_DELIVERY,
            "final-delivery",
        ),
    ]

    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
            Contacts,
            on_delete=models.CASCADE,
            related_name='projects'
        )
    location = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PREPARATION
    )
    cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    started_date = models.DateField()
    initial_delivery = models.DateField()
    final_delivery = models.DateField()


# Financials
class PaymentMethod(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name


class Transaction(models.Model):

    INCOME = "income"
    OUTCOME = "outcome"

    STATUS_CHOICES = [
        (INCOME, "income"),
        (OUTCOME, "outcome"),
    ]

    transaction_date = models.DateField()

    type = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    
    # Payment Method
    # Payment method
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
    )


    statement = models.CharField(
        max_length=100,
    )

    person_reciept = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )

    person_deliver = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )

    # User who entered the transaction
    transaction_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions_created",
    )

    # Confirmation
    checkpoint = models.BooleanField(
        default=False,
    )

    # User who confirmed the transaction
    confirm_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions_confirmed",
    )

    def __str__(self):
        return f"{self.type} - {self.amount}"

