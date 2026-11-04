package com.medishare.model

import jakarta.persistence.*
import java.time.Instant
import java.time.LocalDate

@Entity
@Table(name = "medicine_donations")
data class MedicineDonation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    var donor: User,

    @Column(name = "medicine_name", nullable = false, length = 150)
    var medicineName: String = "",

    @Column(name = "generic_name", length = 150)
    var genericName: String? = null,

    @Column(name = "category", length = 100)
    var category: String? = null,

    @Column(name = "quantity", nullable = false)
    var quantity: Int = 1,

    @Column(name = "unit", nullable = false, length = 30)
    var unit: String = "tablets",

    @Column(name = "expiry_date", nullable = false)
    var expiryDate: LocalDate = LocalDate.now().plusMonths(6),

    @Column(name = "batch_number", length = 50)
    var batchNumber: String? = null,

    @Column(name = "manufacturer", length = 100)
    var manufacturer: String? = null,

    @Column(name = "storage_condition", length = 100)
    var storageCondition: String? = null,

    @Column(name = "condition_notes", columnDefinition = "TEXT")
    var conditionNotes: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    var status: DonationStatus = DonationStatus.PENDING,

    @Column(name = "pickup_address", length = 255)
    var pickupAddress: String? = null,

    @Column(name = "image_proof_url", length = 500)
    var imageProofUrl: String? = null,

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
