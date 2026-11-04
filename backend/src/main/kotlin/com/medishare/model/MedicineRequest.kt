package com.medishare.model

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "medicine_requests")
data class MedicineRequest(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "beneficiary_id", nullable = false)
    var beneficiary: User,

    @Column(name = "medicine_name", nullable = false, length = 150)
    var medicineName: String = "",

    @Column(name = "quantity_requested", nullable = false)
    var quantityRequested: Int = 1,

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_level", nullable = false, length = 20)
    var urgencyLevel: UrgencyLevel = UrgencyLevel.MEDIUM,

    @Column(name = "prescription_proof_url", length = 500)
    var prescriptionProofUrl: String? = null,

    @Column(name = "reason", columnDefinition = "TEXT")
    var reason: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    var status: RequestStatus = RequestStatus.PENDING,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_donation_id")
    var matchedDonation: MedicineDonation? = null,

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    var adminNotes: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
) {
    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }
}
