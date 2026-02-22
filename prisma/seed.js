const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed process...')

    // Clear existing data
    await prisma.clinicalVisit.deleteMany({})
    await prisma.medicationPrescription.deleteMany({})
    await prisma.patientProfile.deleteMany({})
    await prisma.doctorProfile.deleteMany({})
    await prisma.user.deleteMany({})

    // Create Admin
    await prisma.user.create({
        data: {
            email: 'admin@clinic.com',
            password: 'admin', // Simple password for testing
            role: 'admin',
            firstName: 'System',
            lastName: 'Admin',
        },
    })

    // Create Doctor
    const doctor = await prisma.user.create({
        data: {
            email: 'doctor@clinic.com',
            password: 'doctor', // Simple password for testing
            role: 'doctor',
            firstName: 'John',
            lastName: 'Doe',
            specialization: 'Ophthalmology',
            doctorProfile: {
                create: {
                    medicalLicenseNumber: 'MD123456',
                    specialization: 'Retina Specialist',
                    email: 'doctor@clinic.com'
                }
            }
        },
    })

    // Create Patient
    const patient = await prisma.user.create({
        data: {
            email: 'patient@example.com',
            password: 'patient', // Simple password for testing
            role: 'patient',
            firstName: 'Jane',
            lastName: 'Smith',
            patientProfile: {
                create: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'patient@example.com',
                    gender: 'Female',
                    contactNumber: '555-0101',
                    address: '123 Health St',
                }
            }
        },
    })

    // Create Receptionist
    await prisma.user.create({
        data: {
            email: 'receptionist@clinic.com',
            password: 'receptionist',
            role: 'receptionist',
            firstName: 'Sarah',
            lastName: 'Connor',
        },
    })

    console.log('Seed data created successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
