package com.medishare.model

enum class Role {
    ROLE_DONOR,
    ROLE_BENEFICIARY,
    ROLE_NGO,
    ROLE_ADMIN
}

enum class DonationStatus {
    PENDING,
    APPROVED,
    REJECTED,
    COLLECTED,
    COMPLETED
}

enum class RequestStatus {
    PENDING,
    APPROVED,
    FULFILLED,
    REJECTED
}

enum class UrgencyLevel {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
