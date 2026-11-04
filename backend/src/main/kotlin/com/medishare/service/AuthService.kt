package com.medishare.service

import com.medishare.dto.*
import com.medishare.model.ActivityLog
import com.medishare.model.Role
import com.medishare.model.User
import com.medishare.repository.ActivityLogRepository
import com.medishare.repository.UserRepository
import com.medishare.security.JwtTokenProvider
import com.medishare.security.UserPrincipal
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val tokenProvider: JwtTokenProvider,
    private val activityLogRepository: ActivityLogRepository
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        val trimmedEmail = request.email.trim().lowercase()
        if (userRepository.existsByEmail(trimmedEmail)) {
            throw IllegalArgumentException("Email is already registered: $trimmedEmail")
        }

        // Auto-verify donors and beneficiaries; NGOs require admin verification unless admin
        val isVerified = request.role != Role.ROLE_NGO

        val user = User(
            fullName = request.fullName.trim(),
            email = trimmedEmail,
            password = passwordEncoder.encode(request.password),
            role = request.role,
            phone = request.phone,
            address = request.address,
            organizationName = request.organizationName,
            isVerified = isVerified
        )

        val savedUser = userRepository.save(user)

        activityLogRepository.save(
            ActivityLog(
                action = "USER_REGISTERED",
                performedBy = savedUser.email,
                details = "User ${savedUser.fullName} registered with role ${savedUser.role}"
            )
        )

        val token = tokenProvider.generateTokenForUser(
            email = savedUser.email,
            id = savedUser.id,
            role = savedUser.role.name,
            fullName = savedUser.fullName
        )

        return AuthResponse(
            token = token,
            user = UserDTO.fromEntity(savedUser)
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        val trimmedEmail = request.email.trim().lowercase()
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(trimmedEmail, request.password)
        )

        val principal = authentication.principal as UserPrincipal
        val user = principal.user
        val token = tokenProvider.generateToken(authentication)

        activityLogRepository.save(
            ActivityLog(
                action = "USER_LOGIN",
                performedBy = user.email,
                details = "User logged in successfully"
            )
        )

        return AuthResponse(
            token = token,
            user = UserDTO.fromEntity(user)
        )
    }

    fun getCurrentUser(): User {
        val authentication = SecurityContextHolder.getContext().authentication
            ?: throw IllegalStateException("No authenticated security context found")

        val principal = authentication.principal as? UserPrincipal
            ?: throw IllegalStateException("Current principal is not a UserPrincipal")

        return userRepository.findById(principal.user.id)
            .orElseThrow { IllegalStateException("User not found in database") }
    }
}
