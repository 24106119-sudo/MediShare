package com.medishare.service

import com.medishare.dto.ActivityLogDTO
import com.medishare.dto.DonationResponseDTO
import com.medishare.dto.UserDTO
import com.medishare.model.ActivityLog
import com.medishare.repository.ActivityLogRepository
import com.medishare.repository.MedicineDonationRepository
import com.medishare.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class AdminService(
    private val userRepository: UserRepository,
    private val donationRepository: MedicineDonationRepository,
    private val activityLogRepository: ActivityLogRepository
) {

    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserDTO> {
        return userRepository.findAll()
            .map { UserDTO.fromEntity(it) }
    }

    @Transactional
    fun verifyNgo(userId: Long, isVerified: Boolean, actorEmail: String): UserDTO {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found with id: $userId") }

        user.isVerified = isVerified
        val saved = userRepository.save(user)

        activityLogRepository.save(
            ActivityLog(
                action = if (isVerified) "NGO_VERIFIED" else "NGO_UNVERIFIED",
                performedBy = actorEmail,
                details = "Admin set verification status of ${user.organizationName ?: user.fullName} to $isVerified"
            )
        )

        return UserDTO.fromEntity(saved)
    }

    @Transactional(readOnly = true)
    fun getExpiredMedicines(): List<DonationResponseDTO> {
        return donationRepository.findAllByExpiryDateBeforeOrderByExpiryDateAsc(LocalDate.now())
            .map { DonationResponseDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun getActivityLogs(): List<ActivityLogDTO> {
        return activityLogRepository.findTop15ByOrderByCreatedAtDesc()
            .map {
                ActivityLogDTO(
                    id = it.id,
                    action = it.action,
                    performedBy = it.performedBy,
                    details = it.details,
                    createdAt = it.createdAt
                )
            }
    }
}
