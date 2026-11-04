package com.medishare.service

import com.medishare.dto.*
import com.medishare.model.DonationStatus
import com.medishare.model.RequestStatus
import com.medishare.model.Role
import com.medishare.model.User
import com.medishare.repository.ActivityLogRepository
import com.medishare.repository.MedicineDonationRepository
import com.medishare.repository.MedicineRequestRepository
import com.medishare.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class DashboardService(
    private val userRepository: UserRepository,
    private val donationRepository: MedicineDonationRepository,
    private val requestRepository: MedicineRequestRepository,
    private val activityLogRepository: ActivityLogRepository
) {

    @Transactional(readOnly = true)
    fun getDonorDashboard(donor: User): DonorDashboardDTO {
        val total = donationRepository.countByDonor(donor)
        val pending = donationRepository.countByDonorAndStatus(donor, DonationStatus.PENDING)
        val approved = donationRepository.countByDonorAndStatus(donor, DonationStatus.APPROVED)
        val completed = donationRepository.countByDonorAndStatus(donor, DonationStatus.COMPLETED) +
                donationRepository.countByDonorAndStatus(donor, DonationStatus.COLLECTED)

        val recent = donationRepository.findAllByDonorOrderByCreatedAtDesc(donor)
            .take(6)
            .map { DonationResponseDTO.fromEntity(it) }

        return DonorDashboardDTO(
            totalDonations = total,
            pendingDonations = pending,
            approvedDonations = approved,
            completedDonations = completed,
            recentDonations = recent
        )
    }

    @Transactional(readOnly = true)
    fun getBeneficiaryDashboard(beneficiary: User): BeneficiaryDashboardDTO {
        val total = requestRepository.countByBeneficiary(beneficiary)
        val pending = requestRepository.countByBeneficiaryAndStatus(beneficiary, RequestStatus.PENDING)
        val approved = requestRepository.countByBeneficiaryAndStatus(beneficiary, RequestStatus.APPROVED)
        val fulfilled = requestRepository.countByBeneficiaryAndStatus(beneficiary, RequestStatus.FULFILLED)

        val recent = requestRepository.findAllByBeneficiaryOrderByCreatedAtDesc(beneficiary)
            .take(6)
            .map { RequestResponseDTO.fromEntity(it) }

        return BeneficiaryDashboardDTO(
            totalRequests = total,
            pendingRequests = pending,
            approvedRequests = approved,
            fulfilledRequests = fulfilled,
            recentRequests = recent
        )
    }

    @Transactional(readOnly = true)
    fun getAdminDashboard(): AdminDashboardDTO {
        val totalUsers = userRepository.count()
        val totalDonations = donationRepository.count()
        val totalRequests = requestRepository.count()
        val verifiedNgos = userRepository.countByRoleAndIsVerified(Role.ROLE_NGO, true)

        val pendingDonations = donationRepository.countByStatus(DonationStatus.PENDING)
        val pendingRequests = requestRepository.countByStatus(RequestStatus.PENDING)
        val pendingNgos = userRepository.countByRoleAndIsVerified(Role.ROLE_NGO, false)
        val pendingApprovals = pendingDonations + pendingRequests + pendingNgos

        val expiredRecords = donationRepository.countByExpiryDateBefore(LocalDate.now())

        val recentLogs = activityLogRepository.findTop15ByOrderByCreatedAtDesc()
            .map {
                ActivityLogDTO(
                    id = it.id,
                    action = it.action,
                    performedBy = it.performedBy,
                    details = it.details,
                    createdAt = it.createdAt
                )
            }

        return AdminDashboardDTO(
            totalRegisteredUsers = totalUsers,
            totalDonations = totalDonations,
            totalRequests = totalRequests,
            verifiedNgos = verifiedNgos,
            pendingApprovals = pendingApprovals,
            expiredMedicineRecords = expiredRecords,
            recentLogs = recentLogs
        )
    }
}
