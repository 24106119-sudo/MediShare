package com.medishare.model

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "full_name", nullable = false, length = 100)
    var fullName: String = "",

    @Column(name = "email", nullable = false, unique = true, length = 100)
    var email: String = "",

    @Column(name = "password", nullable = false, length = 255)
    var password: String = "",

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 30)
    var role: Role = Role.ROLE_DONOR,

    @Column(name = "phone", length = 20)
    var phone: String? = null,

    @Column(name = "address", length = 255)
    var address: String? = null,

    @Column(name = "organization_name", length = 150)
    var organizationName: String? = null,

    @Column(name = "is_verified", nullable = false)
    var isVerified: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()
)
