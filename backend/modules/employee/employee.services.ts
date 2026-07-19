import {prisma} from "../../lib/prisma";




export interface Employee {
  id: string;
  name: string;
  email: string;
  designation?: string;
  department?: string;
  phone?: string;
  joiningDate: Date;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}


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


const getEmployeeById = async (id: string) => {
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


const createEmployee = async (employeeData: Employee) => {
    try {
        const newEmployee = await prisma.employee.create({
            data: employeeData,
        });
        return newEmployee;
    }
    catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
}

export { getAllEmployees, getEmployeeById, createEmployee };


