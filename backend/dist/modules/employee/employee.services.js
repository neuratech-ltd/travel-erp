import { prisma } from "../../lib/prisma.js";
const normalizeEmployeePayload = (employeeData) => {
    const payload = { ...employeeData };
    if (payload.joiningDate) {
        payload.joiningDate = new Date(payload.joiningDate);
    }
    if (payload.status) {
        payload.status = payload.status.toUpperCase();
    }
    return payload;
};
const getAllEmployees = async () => {
    try {
        const employees = await prisma.employee.findMany();
        console.log("Fetched employees:", employees); // Log the fetched employees for debugging
        return employees;
    }
    catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};
const getEmployeeById = async (id) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: { id },
        });
        return employee;
    }
    catch (error) {
        console.error("Error fetching employee:", error);
        throw error;
    }
};
const createEmployee = async (employeeData) => {
    try {
        const newEmployee = await prisma.employee.create({
            data: normalizeEmployeePayload(employeeData),
        });
        return newEmployee;
    }
    catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
};
const updateEmployee = async (id, employeeData) => {
    try {
        const updatedEmployee = await prisma.employee.update({
            where: { id },
            data: normalizeEmployeePayload(employeeData),
        });
        return updatedEmployee;
    }
    catch (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
};
export { getAllEmployees, getEmployeeById, createEmployee, updateEmployee };
