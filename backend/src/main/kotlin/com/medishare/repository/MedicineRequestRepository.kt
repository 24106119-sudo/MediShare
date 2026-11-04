package com.medishare.repository

import com.medishare.model.MedicineRequest
import com.medishare.model.RequestStatus
import com.medishare.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MedicineRequestRepository : JpaRepository<MedicineRequest, Long> {
    fun findAllByBeneficiaryOrderByCreatedAtDesc(beneficiary: User): List<MedicineRequest>
    fun countByBeneficiary(beneficiary: User): Long
    fun countByBeneficiaryAndStatus(beneficiary: User, status: RequestStatus): Long

    fun countByStatus(status: RequestStatus): Long
    fun findAllByStatusOrderByCreatedAtDesc(status: RequestStatus): List<MedicineRequest>
}
