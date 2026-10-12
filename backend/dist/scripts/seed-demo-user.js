import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
const demoUser = {
    email: 'demo@travel-erp.local',
    name: 'Demo User',
    password: 'Demo@12345',
};
const passwordHash = await bcrypt.hash(demoUser.password, 12);
await prisma.user.upsert({
    where: { email: demoUser.email },
    update: {
        name: demoUser.name,
        password: passwordHash,
    },
    create: {
        email: demoUser.email,
        name: demoUser.name,
        password: passwordHash,
    },
});
console.log(`Demo user is ready: ${demoUser.email}`);
console.log(`Demo password: ${demoUser.password}`);
await prisma.$disconnect();
