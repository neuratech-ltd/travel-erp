import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "@prisma/client";

export type EmployeeStatus = "ACTIVE" | "INACTIVE";

export interface Employee {
  id?: string;
  name: string;
  email: string;
  designation?: string;
  department?: string;
  phone?: string;
  joiningDate?: Date | string;
  status?: EmployeeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const normalizeEmployeePayload = (employeeData: Partial<Employee>) => {
  const payload: Partial<Employee> = { ...employeeData };

  if (payload.joiningDate) {
    payload.joiningDate = new Date(payload.joiningDate);
  }

  if (payload.status) {
    payload.status = payload.status.toUpperCase() as EmployeeStatus;
  }

  return payload;
};

const getAllEmployees = async () => {
  try {
    const employees = await prisma.employee.findMany();
    console.log("Fetched employees:", employees); // Log the fetched employees for debugging
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const getEmployeeById = async (id: string) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });
    return employee;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

const createEmployee = async (employeeData: Employee) => {
  try {
    const newEmployee = await prisma.employee.create({
      data: normalizeEmployeePayload(
        employeeData,
      ) as Prisma.EmployeeCreateInput,
    });
    return newEmployee;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: normalizeEmployeePayload(
        employeeData,
      ) as Prisma.EmployeeUpdateInput,
    });
    return updatedEmployee;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export { getAllEmployees, getEmployeeById, createEmployee, updateEmployee };
