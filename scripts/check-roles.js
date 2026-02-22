const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    const users = await prisma.user.findMany();
    console.log('--- User Roles ---');
    users.forEach(u => {
        console.log(`${u.email}: ${u.role}`);
    });
    console.log('-------------------');
}

checkUsers()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
