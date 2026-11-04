package com.medishare.dto

import java.time.Instant

data class DonorDashboardDTO(
    val totalDonations: Long,
    val pendingDonations: Long,
    val approvedDonations: Long,
    val completedDonations: Long,
    val recentDonations: List<DonationResponseDTO>
)

data class BeneficiaryDashboardDTO(
    val totalRequests: Long,
    val pendingRequests: Long,
    val approvedRequests: Long,
    val fulfilledRequests: Long,
    val recentRequests: List<RequestResponseDTO>
)

data class ActivityLogDTO(
    val id: Long,
    val action: String,
    val performedBy: String,
    val details: String?,
    val createdAt: Instant
)

data class AdminDashboardDTO(
    val totalRegisteredUsers: Long,
    val totalDonations: Long,
    val totalRequests: Long,
    val verifiedNgos: Long,
    val pendingApprovals: Long,
    val expiredMedicineRecords: Long,
    val recentLogs: List<ActivityLogDTO>
)
