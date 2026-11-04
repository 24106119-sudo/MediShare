package com.medishare

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MediShareApplication

fun main(args: Array<String>) {
    runApplication<MediShareApplication>(*args)
}
