import express from 'express';
import * as clientController from './client.controller.js'; 


const router: express.Router = express.Router();

router.get('/', clientController.getClients);
router.post('/', clientController.createClientController);
router.get('/:id', clientController.getClientByIdController);

export default router; 