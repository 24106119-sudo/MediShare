package com.medishare.dto

import com.medishare.model.MedicineRequest
import com.medishare.model.RequestStatus
import com.medishare.model.UrgencyLevel
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.Instant

data class RequestCreateRequest(
    @field:NotBlank(message = "Medicine name is required")
    val medicineName: String,

    @field:NotNull(message = "Quantity requested is required")
    @field:Min(value = 1, message = "Quantity must be at least 1")
    val quantityRequested: Int,

    val urgencyLevel: UrgencyLevel = UrgencyLevel.MEDIUM,
    val prescriptionProofUrl: String? = null,
    val reason: String? = null
)

data class RequestStatusUpdateRequest(
    val status: RequestStatus,
    val matchedDonationId: Long? = null,
    val adminNotes: String? = null
)

data class RequestResponseDTO(
    val id: Long,
    val beneficiaryId: Long,
    val beneficiaryName: String,
    val beneficiaryEmail: String,
    val medicineName: String,
    val quantityRequested: Int,
    val urgencyLevel: UrgencyLevel,
    val prescriptionProofUrl: String?,
    val reason: String?,
    val status: RequestStatus,
    val matchedDonationId: Long?,
    val matchedDonationMedicine: String?,
    val adminNotes: String?,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    companion object {
        fun fromEntity(entity: MedicineRequest): RequestResponseDTO = RequestResponseDTO(
            id = entity.id,
            beneficiaryId = entity.beneficiary.id,
            beneficiaryName = entity.beneficiary.fullName,
            beneficiaryEmail = entity.beneficiary.email,
            medicineName = entity.medicineName,
            quantityRequested = entity.quantityRequested,
            urgencyLevel = entity.urgencyLevel,
            prescriptionProofUrl = entity.prescriptionProofUrl,
            reason = entity.reason,
            status = entity.status,
            matchedDonationId = entity.matchedDonation?.id,
            matchedDonationMedicine = entity.matchedDonation?.medicineName,
            adminNotes = entity.adminNotes,
            createdAt = entity.createdAt,
            updatedAt = entity.updatedAt
        )
    }
}
