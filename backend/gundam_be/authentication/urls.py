from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)

from .views import RegisterUserAPIView, TokenObtainPairPermissionView

urlpatterns = [
    path('token/', TokenObtainPairPermissionView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register', RegisterUserAPIView.as_view(), name='register')
]