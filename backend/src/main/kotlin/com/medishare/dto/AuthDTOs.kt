package com.medishare.dto

import com.medishare.model.Role
import com.medishare.model.User
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class LoginRequest(
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Valid email is required")
    val email: String,

    @field:NotBlank(message = "Password is required")
    val password: String
)

data class RegisterRequest(
    @field:NotBlank(message = "Full name is required")
    val fullName: String,

    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Valid email is required")
    val email: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 6, message = "Password must be at least 6 characters")
    val password: String,

    val role: Role = Role.ROLE_DONOR,
    val phone: String? = null,
    val address: String? = null,
    val organizationName: String? = null
)

data class UserDTO(
    val id: Long,
    val fullName: String,
    val email: String,
    val role: Role,
    val phone: String?,
    val address: String?,
    val organizationName: String?,
    val isVerified: Boolean
) {
    companion object {
        fun fromEntity(user: User): UserDTO = UserDTO(
            id = user.id,
            fullName = user.fullName,
            email = user.email,
            role = user.role,
            phone = user.phone,
            address = user.address,
            organizationName = user.organizationName,
            isVerified = user.isVerified
        )
    }
}

data class AuthResponse(
    val token: String,
    val type: String = "Bearer",
    val user: UserDTO
)

data class MessageResponse(
    val message: String,
    val success: Boolean = true
)
