package com.medishare.config

import com.medishare.model.*
import com.medishare.repository.ActivityLogRepository
import com.medishare.repository.MedicineDonationRepository
import com.medishare.repository.MedicineRequestRepository
import com.medishare.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val donationRepository: MedicineDonationRepository,
    private val requestRepository: MedicineRequestRepository,
    private val activityLogRepository: ActivityLogRepository,
    private val passwordEncoder: PasswordEncoder
) : CommandLineRunner {

    private val logger = LoggerFactory.getLogger(DataInitializer::class.java)

    override fun run(vararg args: String?) {
        if (userRepository.count() == 0L) {
            logger.info("Database is empty. Seeding initial MediShare data...")

            // 1. Seed Users
            val admin = userRepository.save(
                User(
                    fullName = "System Administrator",
                    email = "admin@medishare.org",
                    password = passwordEncoder.encode("admin123"),
                    role = Role.ROLE_ADMIN,
                    phone = "+1-555-0100",
                    address = "100 Health Blvd, Suite 400",
                    organizationName = "MediShare Core",
                    isVerified = true
                )
            )

            val donor = userRepository.save(
                User(
                    fullName = "Sarah Jenkins",
                    email = "donor@medishare.org",
                    password = passwordEncoder.encode("donor123"),
                    role = Role.ROLE_DONOR,
                    phone = "+1-555-0101",
                    address = "742 Evergreen Terrace",
                    organizationName = null,
                    isVerified = true
                )
            )

            val beneficiary = userRepository.save(
                User(
                    fullName = "Robert Martinez",
                    email = "beneficiary@medishare.org",
                    password = passwordEncoder.encode("user123"),
                    role = Role.ROLE_BENEFICIARY,
                    phone = "+1-555-0102",
                    address = "12 Oak Ridge Lane",
                    organizationName = null,
                    isVerified = true
                )
            )

            val ngoVerified = userRepository.save(
                User(
                    fullName = "Care & Hope Health Foundation",
                    email = "ngo@carehope.org",
                    password = passwordEncoder.encode("ngo123"),
                    role = Role.ROLE_NGO,
                    phone = "+1-555-0103",
                    address = "500 Charity Way",
                    organizationName = "Care & Hope Foundation",
                    isVerified = true
                )
            )

            val ngoPending = userRepository.save(
                User(
                    fullName = "Sunrise Community Clinic",
                    email = "pending@sunriseclinic.org",
                    password = passwordEncoder.encode("ngo123"),
                    role = Role.ROLE_NGO,
                    phone = "+1-555-0104",
                    address = "88 Relief Road",
                    organizationName = "Sunrise Clinic NGO",
                    isVerified = false
                )
            )

            // 2. Seed Donations
            val donation1 = donationRepository.save(
                MedicineDonation(
                    donor = donor,
                    medicineName = "Paracetamol 500mg",
                    genericName = "Acetaminophen",
                    category = "Analgesic",
                    quantity = 150,
                    unit = "tablets",
                    expiryDate = LocalDate.now().plusMonths(14),
                    batchNumber = "BATCH-PCM-2024",
                    manufacturer = "GSK Health",
                    storageCondition = "Store below 25C",
                    conditionNotes = "Sealed blister packs in original box",
                    status = DonationStatus.APPROVED,
                    pickupAddress = donor.address,
                    imageProofUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
                )
            )

            val donation2 = donationRepository.save(
                MedicineDonation(
                    donor = donor,
                    medicineName = "Amoxicillin 500mg",
                    genericName = "Amoxicillin Trihydrate",
                    category = "Antibiotic",
                    quantity = 60,
                    unit = "capsules",
                    expiryDate = LocalDate.now().plusMonths(9),
                    batchNumber = "BATCH-AMX-8821",
                    manufacturer = "Pfizer Inc.",
                    storageCondition = "Keep in dry cool place",
                    conditionNotes = "Unopened bottles",
                    status = DonationStatus.PENDING,
                    pickupAddress = donor.address,
                    imageProofUrl = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"
                )
            )

            val donation3 = donationRepository.save(
                MedicineDonation(
                    donor = donor,
                    medicineName = "Metformin 850mg",
                    genericName = "Metformin Hydrochloride",
                    category = "Antidiabetic",
                    quantity = 120,
                    unit = "tablets",
                    expiryDate = LocalDate.now().plusMonths(12),
                    batchNumber = "BATCH-MET-4412",
                    manufacturer = "Merck KGaA",
                    storageCondition = "Room temperature",
                    conditionNotes = "Factory sealed foil",
                    status = DonationStatus.APPROVED,
                    pickupAddress = donor.address,
                    imageProofUrl = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500"
                )
            )

            // Expired donation for testing expired medicine records query!
            val donationExpired = donationRepository.save(
                MedicineDonation(
                    donor = donor,
                    medicineName = "Expired Cetirizine 10mg",
                    genericName = "Cetirizine HCl",
                    category = "Antihistamine",
                    quantity = 50,
                    unit = "tablets",
                    expiryDate = LocalDate.now().minusMonths(3), // Expired!
                    batchNumber = "BATCH-EXP-001",
                    manufacturer = "Sun Pharma",
                    storageCondition = "Room temperature",
                    conditionNotes = "Expired batch recorded for safety quarantine monitoring",
                    status = DonationStatus.REJECTED,
                    pickupAddress = donor.address,
                    imageProofUrl = "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500"
                )
            )

            val donationCompleted = donationRepository.save(
                MedicineDonation(
                    donor = donor,
                    medicineName = "Omeprazole 20mg",
                    genericName = "Omeprazole",
                    category = "Antacid",
                    quantity = 90,
                    unit = "capsules",
                    expiryDate = LocalDate.now().plusMonths(6),
                    batchNumber = "BATCH-OMP-9903",
                    manufacturer = "AstraZeneca",
                    storageCondition = "Below 30C",
                    conditionNotes = "Distributed to community clinic for chronic gastritis",
                    status = DonationStatus.COMPLETED,
                    pickupAddress = donor.address,
                    imageProofUrl = "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500"
                )
            )

            // 3. Seed Requests
            requestRepository.save(
                MedicineRequest(
                    beneficiary = beneficiary,
                    medicineName = "Paracetamol 500mg",
                    quantityRequested = 30,
                    urgencyLevel = UrgencyLevel.MEDIUM,
                    prescriptionProofUrl = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500",
                    reason = "Fever relief for elder family member",
                    status = RequestStatus.PENDING,
                    adminNotes = "Under review by volunteer pharmacist"
                )
            )

            requestRepository.save(
                MedicineRequest(
                    beneficiary = beneficiary,
                    medicineName = "Metformin 850mg",
                    quantityRequested = 60,
                    urgencyLevel = UrgencyLevel.HIGH,
                    prescriptionProofUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500",
                    reason = "Monthly diabetes management medication",
                    status = RequestStatus.APPROVED,
                    matchedDonation = donation3,
                    adminNotes = "Approved for dispatch via NGO courier"
                )
            )

            requestRepository.save(
                MedicineRequest(
                    beneficiary = beneficiary,
                    medicineName = "Amoxicillin 500mg",
                    quantityRequested = 20,
                    urgencyLevel = UrgencyLevel.CRITICAL,
                    prescriptionProofUrl = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500",
                    reason = "Severe respiratory infection treatment",
                    status = RequestStatus.FULFILLED,
                    matchedDonation = donation2,
                    adminNotes = "Successfully delivered to beneficiary"
                )
            )

            // 4. Activity Logs
            activityLogRepository.save(
                ActivityLog(
                    action = "INITIAL_SEED",
                    performedBy = "System",
                    details = "Initialized database with sample users, donations, requests, and quarantine records"
                )
            )

            logger.info("MediShare database successfully initialized with verified seed data!")
        }
    }
}
