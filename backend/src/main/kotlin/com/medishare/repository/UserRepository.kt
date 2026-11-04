package com.medishare.repository

import com.medishare.model.Role
import com.medishare.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
    fun existsByEmail(email: String): Boolean
    fun countByRole(role: Role): Long
    fun countByRoleAndIsVerified(role: Role, isVerified: Boolean): Long
    fun findAllByRole(role: Role): List<User>
}
