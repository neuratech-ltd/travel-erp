import { getAllEmployees, Employee, createEmployee, getEmployeeById} from "./employee.services";




const getEmployees = async (req : Employee, res : any) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json({ success: true, data: employees });
  }
    catch (error) {
    console.error("Error in getEmployees controller:", error);
    res.status(500).json({ success: false, message: "Failed to fetch employees" });
  }
};

const getEmployeeByIdController = async (req : any, res : any) => {
  const { id } = req.params;
    try {
    const employee = await getEmployeeById(id);
    if (employee) {
      res.status(200).json({ success: true, data: employee });
    } else {
        res.status(404).json({ success: false, message: "Employee not found" });
    }
  }
    catch (error) {
    console.error("Error in getEmployeeById controller:", error);
    res.status(500).json({ success: false, message: "Failed to fetch employee" });
  }
};


const createEmployeeController = async (req: any, res: any) => {
  const employeeData: Employee = req.body;
  try {
    const newEmployee = await createEmployee(employeeData);
    res.status(201).json({ success: true, data: newEmployee });
  }
  catch (error) {
    console.error("Error in createEmployeeController:", error);
    res.status(500).json({ success: false, message: "Failed to create employee" });
  }
};

export { getEmployees, getEmployeeByIdController, createEmployeeController };