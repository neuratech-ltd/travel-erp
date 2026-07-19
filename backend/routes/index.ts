import express from "express";
import clientRoute from "../modules/client/client.routes.js";
import aiRoute from "../modules/ai/ai.routes.js";  
import employeeRoute from "../modules/employee/employee.routes.js"; 


const router : express.Router = express.Router();

router.use("/clients", clientRoute);
router.use("/ai", aiRoute);
router.use("/employees", employeeRoute);


export default router;