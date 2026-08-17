from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Category, Product, Contacts, Unit, Project, PaymentMethod, Transaction
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, get_object_or_404

# dashboard
from rest_framework.views import APIView
from django.db.models import Sum

# image upload: 
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CategorySerializer,
    UnitSerializer,
    ProductSerializer,
    ProductCreateSerializer,
    ContactsSerializer,
    ContactsPagination,   
    ContactsCreateSerializer,
    ProjectSerializer,
    ProjectCreateSerializer,
    ProjectUpdateSerializer,

     PaymentMethodSerializer,
    PaymentMethodCreateSerializer,

    TransactionSerializer,
    TransactionCreateSerializer,
    TransactionUpdateSerializer,
)

from .pagination import ProjectPagination


# Create your views here.


# =========================================================
# REGISTER
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):

    serializer = RegisterSerializer(
        data=request.data
    )

    if serializer.is_valid():

        user = serializer.save()

        return Response(
            {
                "message": "User Created Successfully",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )

    print("REGISTER ERRORS:", serializer.errors)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# Get currently logged-in user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    serializer = UserSerializer(request.user)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )



# Add a new category
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_category_view(request):

    serializer = CategorySerializer(data=request.data)

    if serializer.is_valid():
        category = serializer.save()

        return Response(
            {
                "message": "Category created successfully",
                "category": CategorySerializer(category).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# Get all Categories
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def categories_view(request):

    categories = Category.objects.all()

    serializer = CategorySerializer(categories, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# Add a new unit
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_unit_view(request):

    serializer = UnitSerializer(data=request.data)

    if serializer.is_valid():
        unit = serializer.save()

        return Response(
            {
                "message": "Unit created successfully",
                "unit": UnitSerializer(unit).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# Get all units
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def units_view(request):

    units = Unit.objects.all()

    serializer = UnitSerializer(units, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

# =========================================================
# CREATE PRODUCT
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_product_view(request):

    serializer = ProductCreateSerializer(
        data=request.data
    )

    if serializer.is_valid():

        product = serializer.save()

        response_serializer = ProductSerializer(
            product
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# GET ALL PRODUCTS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_products_view(request):

    products = Product.objects.select_related(
        "category",
        "unit",
    ).all()

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )



# =========================================================
# GET ALL CONTACTS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_contacts_view(request):

    contacts = Contacts.objects.all().order_by("-id")

    paginator = ContactsPagination()

    page = paginator.paginate_queryset(
        contacts,
        request
    )

    serializer = ContactsSerializer(
        page,
        many=True
    )

    return paginator.get_paginated_response(
        serializer.data
    )


# =========================================================
# CREATE CONTACT
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_contact_view(request):

    serializer = ContactsCreateSerializer(
        data=request.data
    )

    if serializer.is_valid():

        contact = serializer.save()

        response_serializer = ContactsSerializer(
            contact
        )

        return Response(
            {
                "message": "Contact created successfully",
                "contact": response_serializer.data,
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

##########################################
# Projects
##########################################
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_projects_view(request):

    projects = Project.objects.select_related(
        "owner"
    ).order_by("-id")

    paginator = ProjectPagination()

    page = paginator.paginate_queryset(
        projects,
        request
    )

    serializer = ProjectSerializer(
        page,
        many=True
    )

    return paginator.get_paginated_response(
        serializer.data
    )


# =========================================================
# GET SINGLE PROJECT
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_project_view(request, project_id):

    try:

        project = Project.objects.select_related(
            "owner"
        ).get(
            id=project_id
        )

    except Project.DoesNotExist:

        return Response(
            {
                "detail": "Project not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProjectSerializer(
        project
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# =========================================================
# CREATE PROJECT
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project_view(request):

    serializer = ProjectCreateSerializer(
        data=request.data
    )

    if serializer.is_valid():

        project = serializer.save()

        response_serializer = ProjectSerializer(
            project
        )

        return Response(
            {
                "message": "Project created successfully.",
                "project": response_serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# UPDATE PROJECT
# PUT / PATCH
# =========================================================

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_project_view(
    request,
    project_id
):

    try:

        project = Project.objects.get(
            id=project_id
        )

    except Project.DoesNotExist:

        return Response(
            {
                "detail": "Project not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    # -----------------------------------------------------
    # PUT = update all required fields
    # PATCH = update only supplied fields
    # -----------------------------------------------------

    partial = request.method == "PATCH"

    serializer = ProjectUpdateSerializer(
        project,
        data=request.data,
        partial=partial
    )

    if serializer.is_valid():

        project = serializer.save()

        response_serializer = ProjectSerializer(
            project
        )

        return Response(
            {
                "message": "Project updated successfully.",
                "project": response_serializer.data
            },
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


#####################################################
# Payment method views
#####################################################
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payment_methods_list(request):

    payment_methods = PaymentMethod.objects.all().order_by("name")

    serializer = PaymentMethodSerializer(
        payment_methods,
        many=True
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )

##################################################
# Create payment method
##################################################
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def payment_method_create(request):

    serializer = PaymentMethodCreateSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    payment_method = serializer.save()

    response_serializer = PaymentMethodSerializer(
        payment_method
    )

    return Response(
        response_serializer.data,
        status=status.HTTP_201_CREATED
    )


##################################################
# Update Payment Method
##################################################
@api_view(["PATCH", "PUT"])
@permission_classes([IsAuthenticated])
def payment_method_update(
    request,
    payment_method_id
):

    payment_method = get_object_or_404(
        PaymentMethod,
        id=payment_method_id
    )

    serializer = PaymentMethodCreateSerializer(
        payment_method,
        data=request.data,
        partial=request.method == "PATCH"
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    payment_method = serializer.save()

    response_serializer = PaymentMethodSerializer(
        payment_method
    )

    return Response(
        response_serializer.data,
        status=status.HTTP_200_OK
    )

######################################
# Serializers
#####################################
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def payment_method_delete(
    request,
    payment_method_id
):

    payment_method = get_object_or_404(
        PaymentMethod,
        id=payment_method_id
    )

    payment_method.delete()

    return Response(
        {
            "message": "تم حذف طريقة الدفع بنجاح"
        },
        status=status.HTTP_200_OK
    )


#########################################
# FETCH Transaction
#########################################
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def transactions_list(request):

    transactions = (
        Transaction.objects
        .select_related(
            "payment_method",
            "transaction_user",
            "confirm_user",
        )
        .order_by(
            "-transaction_date",
            "-id"
        )
    )

    paginator = TransactionPagination()

    page = paginator.paginate_queryset(
        transactions,
        request
    )

    serializer = TransactionSerializer(
        page,
        many=True
    )

    return paginator.get_paginated_response(
        serializer.data
    )

###########################################
# Fetch One Serializer
############################################
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def transaction_detail(
    request,
    transaction_id
):

    transaction = get_object_or_404(
        Transaction.objects.select_related(
            "payment_method",
            "transaction_user",
            "confirm_user",
        ),
        id=transaction_id
    )

    serializer = TransactionSerializer(
        transaction
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# Create transaction
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def transaction_create(request):

    serializer = TransactionCreateSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    transaction = serializer.save(
        transaction_user=request.user,
        checkpoint=False,
        confirm_user=None,
    )

    response_serializer = TransactionSerializer(
        transaction
    )

    return Response(
        response_serializer.data,
        status=status.HTTP_201_CREATED
    )


# Update transaction
@api_view(["PATCH", "PUT"])
@permission_classes([IsAuthenticated])
def transaction_update(
    request,
    transaction_id
):

    transaction = get_object_or_404(
        Transaction,
        id=transaction_id
    )

    old_checkpoint = transaction.checkpoint

    serializer = TransactionUpdateSerializer(
        transaction,
        data=request.data,
        partial=request.method == "PATCH"
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    transaction = serializer.save()

    # =====================================================
    # CONFIRM TRANSACTION
    # =====================================================

    if (
        not old_checkpoint
        and transaction.checkpoint
    ):

        transaction.confirm_user = request.user

        transaction.save(
            update_fields=[
                "confirm_user"
            ]
        )

    # =====================================================
    # CANCEL CONFIRMATION
    # =====================================================

    elif (
        old_checkpoint
        and not transaction.checkpoint
    ):

        transaction.confirm_user = None

        transaction.save(
            update_fields=[
                "confirm_user"
            ]
        )

    response_serializer = TransactionSerializer(
        transaction
    )

    return Response(
        response_serializer.data,
        status=status.HTTP_200_OK
    )

# Delete Transaction 
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def transaction_delete(
    request,
    transaction_id
):

    transaction = get_object_or_404(
        Transaction,
        id=transaction_id
    )

    transaction.delete()

    return Response(
        {
            "message": "تم حذف المعاملة بنجاح"
        },
        status=status.HTTP_200_OK
    )