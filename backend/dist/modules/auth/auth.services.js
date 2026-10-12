import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
export const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        return null;
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        return null;
    }
    return {
        id: user.id,
        email: user.email,
        name: user.name,
    };
};
export const getUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};
