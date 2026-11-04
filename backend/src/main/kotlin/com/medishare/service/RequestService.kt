package com.medishare.service

import com.medishare.dto.RequestCreateRequest
import com.medishare.dto.RequestResponseDTO
import com.medishare.dto.RequestStatusUpdateRequest
import com.medishare.model.ActivityLog
import com.medishare.model.MedicineRequest
import com.medishare.model.RequestStatus
import com.medishare.model.User
import com.medishare.repository.ActivityLogRepository
import com.medishare.repository.MedicineDonationRepository
import com.medishare.repository.MedicineRequestRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RequestService(
    private val requestRepository: MedicineRequestRepository,
    private val donationRepository: MedicineDonationRepository,
    private val activityLogRepository: ActivityLogRepository
) {

    @Transactional
    fun createRequest(beneficiary: User, req: RequestCreateRequest): RequestResponseDTO {
        val request = MedicineRequest(
            beneficiary = beneficiary,
            medicineName = req.medicineName.trim(),
            quantityRequested = req.quantityRequested,
            urgencyLevel = req.urgencyLevel,
            prescriptionProofUrl = req.prescriptionProofUrl,
            reason = req.reason?.trim(),
            status = RequestStatus.PENDING
        )

        val saved = requestRepository.save(request)

        activityLogRepository.save(
            ActivityLog(
                action = "REQUEST_CREATED",
                performedBy = beneficiary.email,
                details = "Requested ${saved.quantityRequested} of ${saved.medicineName} (Urgency: ${saved.urgencyLevel})"
            )
        )

        return RequestResponseDTO.fromEntity(saved)
    }

    @Transactional(readOnly = true)
    fun getRequestsByBeneficiary(beneficiary: User): List<RequestResponseDTO> {
        return requestRepository.findAllByBeneficiaryOrderByCreatedAtDesc(beneficiary)
            .map { RequestResponseDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun getAllRequests(): List<RequestResponseDTO> {
        return requestRepository.findAll()
            .sortedByDescending { it.createdAt }
            .map { RequestResponseDTO.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun getRequestById(id: Long): RequestResponseDTO {
        val request = requestRepository.findById(id)
            .orElseThrow { NoSuchElementException("Medicine request not found with id: $id") }
        return RequestResponseDTO.fromEntity(request)
    }

    @Transactional
    fun updateStatus(id: Long, req: RequestStatusUpdateRequest, actorEmail: String): RequestResponseDTO {
        val request = requestRepository.findById(id)
            .orElseThrow { NoSuchElementException("Medicine request not found with id: $id") }

        val oldStatus = request.status
        request.status = req.status

        if (!req.adminNotes.isNullOrBlank()) {
            request.adminNotes = req.adminNotes
        }

        if (req.matchedDonationId != null) {
            val donation = donationRepository.findById(req.matchedDonationId).orElse(null)
            request.matchedDonation = donation
        }

        val updated = requestRepository.save(request)

        activityLogRepository.save(
            ActivityLog(
                action = "REQUEST_STATUS_UPDATED",
                performedBy = actorEmail,
                details = "Updated request #${updated.id} (${updated.medicineName}) status from $oldStatus to ${updated.status}"
            )
        )

        return RequestResponseDTO.fromEntity(updated)
    }
}
