import "dotenv/config"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
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
            role: 'admin',
            firstName: 'System',
            lastName: 'Admin',
        },
    })

    // Create Doctor
    const doctor = await prisma.user.create({
        data: {
            email: 'doctor@clinic.com',
            role: 'doctor',
            firstName: 'John',
            lastName: 'Doe',
            specialization: 'Ophthalmology',
            doctorProfile: {
                create: {
                    medicalLicenseNumber: 'MD123456',
                    specialization: 'Retina Specialist',
                    email: 'john.doe@clinic.com'
                }
            }
        },
    })

    // Create Patient
    const patient = await prisma.user.create({
        data: {
            email: 'patient@example.com',
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
