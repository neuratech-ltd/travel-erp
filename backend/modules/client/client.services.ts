import { prisma } from "../../lib/prisma.js";

export interface Client {
  id: string;
  name: string;
  email: string;
  passportNumber?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const getAllClients = async () => {
  try {
    const clients = await prisma.client.findMany();
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

const getClientById = async (id: string) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });
    return client;
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

const createClient = async (clientData: Client) => {
  try {
    const newClient = await prisma.client.create({
      data: clientData,
    });
    return newClient;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

const updateClient = async (id: string, clientData: Partial<Client>) => {
  try {
    const updatedClient = await prisma.client.update({
      where: { id },
      data: clientData,
    });
    return updatedClient;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export { getAllClients, getClientById, createClient, updateClient };
