import express from 'express'
import * as employeeController from './employee.controller.js'

const router: express.Router = express.Router()

router.get('/', employeeController.getEmployees)
router.post('/', employeeController.createEmployeeController)
router.get('/:id', employeeController.getEmployeeByIdController)
router.put('/:id', employeeController.updateEmployeeController)

export default router
