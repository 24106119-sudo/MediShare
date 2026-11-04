package com.medishare.service

import com.medishare.dto.DonationCreateRequest
import com.medishare.dto.DonationResponseDTO
import com.medishare.dto.DonationStatusUpdateRequest
import com.medishare.model.ActivityLog
import com.medishare.model.DonationStatus
import com.medishare.model.MedicineDonation
import com.medishare.model.Role
import com.medishare.model.User
import com.medishare.repository.ActivityLogRepository
import com.medishare.repository.MedicineDonationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class DonationService(
    private val donationRepository: MedicineDonationRepository,
    private val activityLogRepository: ActivityLogRepository
) {

    @Transactional
    fun createDonation(donorUser: User, req: DonationCreateRequest): DonationResponseDTO {
        val donation = MedicineDonation(
            donor = donorUser,
            medicineName = req.medicineName.trim(),
            genericName = req.genericName?.trim(),
            category = req.category?.trim(),
            quantity = req.quantity,
            unit = req.unit.trim(),
            expiryDate = req.expiryDate,
            batchNumber = req.batchNumber?.trim(),
            manufacturer = req.manufacturer?.trim(),
            storageCondition = req.storageCondition?.trim(),
            conditionNotes = req.conditionNotes?.trim(),
            status = DonationStatus.PENDING,
            pickupAddress = req.pickupAddress ?: donorUser.address,
            imageProofUrl = req.imageProofUrl
        )

        val saved = donationRepository.save(donation)

        activityLogRepository.save(
            ActivityLog(
                action = "DONATION_CREATED",
                performedBy = donorUser.email,
                details = "Donated ${saved.quantity} ${saved.unit} of ${saved.medicineName} (Batch: ${saved.batchNumber ?: "N/A"})"
            )
        )

        return DonationResponseDTO.fromEntity(saved)
    }

    @Transactional(readOnly = true)
    fun getDonationsByDonor(donorUser: User): List<DonationResponseDTO> {
        return donationRepository.findAllByDonorOrderByCreatedAtDesc(donorUser)
            .map { DonationResponseDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun getAllDonations(): List<DonationResponseDTO> {
        return donationRepository.findAll()
            .sortedByDescending { it.createdAt }
            .map { DonationResponseDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun getAvailableDonations(): List<DonationResponseDTO> {
        return donationRepository.findAllByStatusAndExpiryDateAfterOrderByExpiryDateAsc(
            DonationStatus.APPROVED,
            LocalDate.now()
        ).map { DonationResponseDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun getDonationById(id: Long): DonationResponseDTO {
        val donation = donationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Donation not found with id: $id") }
        return DonationResponseDTO.fromEntity(donation)
    }

    @Transactional
    fun updateStatus(id: Long, req: DonationStatusUpdateRequest, actorEmail: String): DonationResponseDTO {
        val donation = donationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Donation not found with id: $id") }

        val oldStatus = donation.status
        donation.status = req.status
        if (!req.notes.isNullOrBlank()) {
            donation.conditionNotes = if (donation.conditionNotes.isNullOrBlank()) {
                req.notes
            } else {
                "${donation.conditionNotes}\n[Admin Note]: ${req.notes}"
            }
        }

        val updated = donationRepository.save(donation)

        activityLogRepository.save(
            ActivityLog(
                action = "DONATION_STATUS_UPDATED",
                performedBy = actorEmail,
                details = "Updated donation #${updated.id} (${updated.medicineName}) status from $oldStatus to ${updated.status}"
            )
        )

        return DonationResponseDTO.fromEntity(updated)
    }

    @Transactional
    fun deleteDonation(id: Long, currentUser: User) {
        val donation = donationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Donation not found with id: $id") }

        if (currentUser.role != Role.ROLE_ADMIN && donation.donor.id != currentUser.id) {
            throw IllegalAccessException("You do not have permission to delete this donation")
        }

        donationRepository.delete(donation)
        activityLogRepository.save(
            ActivityLog(
                action = "DONATION_DELETED",
                performedBy = currentUser.email,
                details = "Deleted donation #${id} (${donation.medicineName})"
            )
        )
    }
}
