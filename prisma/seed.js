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
            email: 'admin@sankaraeye.com',
            password: 'admin123',
            role: 'admin',
            firstName: 'System',
            lastName: 'Administrator',
        },
    })

    // Create Doctor - Ophthalmologist
    const doctor = await prisma.user.create({
        data: {
            email: 'doctor@sankaraeye.com',
            password: 'doctor123',
            role: 'doctor',
            firstName: 'Priya',
            lastName: 'Sharma',
            specialization: 'Cataract & IOL',
            doctorProfile: {
                create: {
                    medicalLicenseNumber: 'KA-MED-2018-04521',
                    specialization: 'Cataract & IOL Specialist',
                    email: 'doctor@sankaraeye.com'
                }
            }
        },
    })

    // Create Patient
    const patient = await prisma.user.create({
        data: {
            email: 'patient@sankaraeye.com',
            password: 'patient123',
            role: 'patient',
            firstName: 'Ravi',
            lastName: 'Kumar',
            patientProfile: {
                create: {
                    firstName: 'Ravi',
                    lastName: 'Kumar',
                    email: 'patient@sankaraeye.com',
                    gender: 'Male',
                    contactNumber: '+91-9876543210',
                    address: '14, Brigade Road, Bengaluru, Karnataka 560001',
                }
            }
        },
    })

    // Create Receptionist
    await prisma.user.create({
        data: {
            email: 'reception@sankaraeye.com',
            password: 'reception123',
            role: 'receptionist',
            firstName: 'Ananya',
            lastName: 'Reddy',
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
