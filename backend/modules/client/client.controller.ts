import {
  getClientById,
  getAllClients,
  Client,
  createClient,
  updateClient,
} from "./client.services.js";

const getClients = async (req: Client, res: any) => {
  try {
    const clients = await getAllClients();
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    console.error("Error in getClients controller:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch clients" });
  }
};

const getClientByIdController = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const client = await getClientById(id);
    if (client) {
      res.status(200).json({ success: true, data: client });
    } else {
      res.status(404).json({ success: false, message: "Client not found" });
    }
  } catch (error) {
    console.error("Error in getClientById controller:", error);
    res.status(500).json({ success: false, message: "Failed to fetch client" });
  }
};

const createClientController = async (req: any, res: any) => {
  const clientData: Client = req.body;
  try {
    const newClient = await createClient(clientData);
    res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    console.error("Error in createClientController:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create client" });
  }
};

const updateClientController = async (req: any, res: any) => {
  const { id } = req.params;
  const clientData: Partial<Client> = req.body;
  try {
    const updatedClient = await updateClient(id, clientData);
    res.status(200).json({ success: true, data: updatedClient });
  } catch (error) {
    console.error("Error in updateClientController:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update client" });
  }
};

export {
  getClients,
  getClientByIdController,
  createClientController,
  updateClientController,
};
