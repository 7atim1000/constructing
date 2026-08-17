from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [

    # path('', views.home),

    # Authentication
    path('register/', views.register_view),
    path('me/', views.me_view),
    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Categories
    path('categories/', views.categories_view, name="categories"),
    path('categories/add/', views.add_category_view, name="add-category"),

    # Units
    path('units/', views.units_view, name="units"),
    path('units/add/', views.add_unit_view, name="add-unit"),

    # Products
    path('products/', views.get_products_view, name="products"),
    path('products/add/', views.create_product_view, name="add-product"),

    # Contacts
    path('contacts/', views.get_contacts_view),
    path('contacts/add/', views.add_contact_view),

    
    # Projects
    path(
        "projects/",
        views.get_projects_view,
        name="get-projects"
    ),

    path(
        "projects/add/",
        views.create_project_view,
        name="create-project"
    ),
     path(
        "projects/<int:project_id>/",
        views.get_project_view,
        name="get-project"
    ),

    path(
        "projects/<int:project_id>/update/",
        views.update_project_view,
        name="update-project"
    ),


   

    # =====================================================
    # PAYMENT METHODS
    # =====================================================

    path(
        "payment-methods/",
        views.payment_methods_list,
        name="payment-methods-list",
    ),

    path(
        "payment-methods/add/",
        views.payment_method_create,
        name="payment-method-create",
    ),

    path(
        "payment-methods/<int:payment_method_id>/update/",
        views.payment_method_update,
        name="payment-method-update",
    ),

    path(
        "payment-methods/<int:payment_method_id>/delete/",
        views.payment_method_delete,
        name="payment-method-delete",
    ),

    # =====================================================
    # TRANSACTIONS
    # =====================================================

    path(
        "transactions/",
        views.transactions_list,
        name="transactions-list",
    ),

    path(
        "transactions/<int:transaction_id>/",
        views.transaction_detail,
        name="transaction-detail",
    ),

    path(
        "transactions/add/",
        views.transaction_create,
        name="transaction-create",
    ),

    path(
        "transactions/<int:transaction_id>/update/",
        views.transaction_update,
        name="transaction-update",
    ),

    path(
        "transactions/<int:transaction_id>/delete/",
        views.transaction_delete,
        name="transaction-delete",
    ),
]


