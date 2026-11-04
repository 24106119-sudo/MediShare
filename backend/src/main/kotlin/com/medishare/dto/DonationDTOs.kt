package com.medishare.dto

import com.medishare.model.DonationStatus
import com.medishare.model.MedicineDonation
import jakarta.validation.constraints.Future
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.Instant
import java.time.LocalDate

data class DonationCreateRequest(
    @field:NotBlank(message = "Medicine name is required")
    val medicineName: String,

    val genericName: String? = null,
    val category: String? = null,

    @field:NotNull(message = "Quantity is required")
    @field:Min(value = 1, message = "Quantity must be at least 1")
    val quantity: Int,

    val unit: String = "tablets",

    @field:NotNull(message = "Expiry date is required")
    val expiryDate: LocalDate,

    val batchNumber: String? = null,
    val manufacturer: String? = null,
    val storageCondition: String? = null,
    val conditionNotes: String? = null,
    val pickupAddress: String? = null,
    val imageProofUrl: String? = null
)

data class DonationStatusUpdateRequest(
    val status: DonationStatus,
    val notes: String? = null
)

data class DonationResponseDTO(
    val id: Long,
    val donorId: Long,
    val donorName: String,
    val donorEmail: String,
    val medicineName: String,
    val genericName: String?,
    val category: String?,
    val quantity: Int,
    val unit: String,
    val expiryDate: LocalDate,
    val batchNumber: String?,
    val manufacturer: String?,
    val storageCondition: String?,
    val conditionNotes: String?,
    val status: DonationStatus,
    val pickupAddress: String?,
    val imageProofUrl: String?,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    companion object {
        fun fromEntity(entity: MedicineDonation): DonationResponseDTO = DonationResponseDTO(
            id = entity.id,
            donorId = entity.donor.id,
            donorName = entity.donor.fullName,
            donorEmail = entity.donor.email,
            medicineName = entity.medicineName,
            genericName = entity.genericName,
            category = entity.category,
            quantity = entity.quantity,
            unit = entity.unit,
            expiryDate = entity.expiryDate,
            batchNumber = entity.batchNumber,
            manufacturer = entity.manufacturer,
            storageCondition = entity.storageCondition,
            conditionNotes = entity.conditionNotes,
            status = entity.status,
            pickupAddress = entity.pickupAddress,
            imageProofUrl = entity.imageProofUrl,
            createdAt = entity.createdAt,
            updatedAt = entity.updatedAt
        )
    }
}
