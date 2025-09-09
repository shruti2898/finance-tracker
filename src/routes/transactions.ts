import { FastifyInstance } from "fastify";
import * as transactionsService from "../services/transaction-service";

export default async function transactionsRoutes(fastify: FastifyInstance) {
  fastify.post("/transactions", async (req, reply) => {
    const transaction = await transactionsService.createTransaction(req.body);
    reply.send(transaction);
  });

  fastify.get("/transactions", async () => {
    return transactionsService.getAllTransactions();
  });

  fastify.get("/transactions/:id", async (req, reply) => {
    const { id } = req.params as any;
    const transaction = await transactionsService.getTransactionById(Number(id));
    if (!transaction) return reply.code(404).send("Transaction not found");
    return transaction;
  });

  fastify.put("/transactions/:id", async (req, reply) => {
    const { id } = req.params as any;
    const updated = await transactionsService.updateTransaction(Number(id), req.body);
    if (!updated) return reply.code(404).send("Transaction not found");
    return updated;
  });

  fastify.delete("/transactions/:id", async (req, reply) => {
    const { id } = req.params as any;
    await transactionsService.deleteTransaction(Number(id));
    return { message: "Deleted successfully" };
  });

  fastify.get("/summary", async () => {
    return transactionsService.getSummary();
  });
}
