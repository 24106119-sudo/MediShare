package com.medishare.repository

import com.medishare.model.DonationStatus
import com.medishare.model.MedicineDonation
import com.medishare.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface MedicineDonationRepository : JpaRepository<MedicineDonation, Long> {
    fun findAllByDonorOrderByCreatedAtDesc(donor: User): List<MedicineDonation>
    fun countByDonor(donor: User): Long
    fun countByDonorAndStatus(donor: User, status: DonationStatus): Long

    fun countByStatus(status: DonationStatus): Long
    fun findAllByStatusOrderByCreatedAtDesc(status: DonationStatus): List<MedicineDonation>

    // Query for expired medicines
    fun countByExpiryDateBefore(date: LocalDate): Long
    fun findAllByExpiryDateBeforeOrderByExpiryDateAsc(date: LocalDate): List<MedicineDonation>

    // Available medicines for beneficiaries to request (APPROVED and not expired)
    fun findAllByStatusAndExpiryDateAfterOrderByExpiryDateAsc(status: DonationStatus, date: LocalDate): List<MedicineDonation>
}
