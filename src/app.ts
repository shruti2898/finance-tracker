import Fastify, { FastifyInstance } from "fastify";

// Transaction type
interface Transaction {
  id: number;
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string;
  date: string;
}

const transactions: Transaction[] = [];

// Schema validation
const transactionSchema = {
  type: "object",
  required: ["amount", "type", "category"],
  properties: {
    id: { type: "number" },
    amount: { type: "number" },
    type: { type: "string", enum: ["income", "expense"] },
    category: { type: "string" },
    description: { type: "string" },
    date: { type: "string", format: "date-time" }
  }
};

export function buildApp(): FastifyInstance {
  const fastify = Fastify();

  // Create a new transaction
  fastify.post<{ Body: Omit<Transaction, "id" | "date"> }>("/transactions", { schema: { body: transactionSchema } }, (request, reply) => {
    const { amount, type, category, description } = request.body;
    const totalTransactions = transactions.length;
    const txId = totalTransactions === 0 ? 1 : transactions[totalTransactions - 1].id + 1;

    const transaction: Transaction = {
      id: txId,
      amount,
      type,
      category,
      description: description || "",
      date: new Date().toISOString()
    };

    transactions.push(transaction);
    reply.send(transaction);
  });

  // Get all transactions
  fastify.get("/transactions", async () => transactions);

  // Get a transaction by ID
  fastify.get<{ Params: { id: string } }>("/transactions/:id", async (request, reply) => {
    const txId = Number(request.params.id);
    const transaction = transactions.find(t => t.id === txId);
    if (!transaction) return reply.code(404).send(`Transaction not found for Id: ${txId}`);
    return transaction;
  });

  // Update a transaction by ID
  fastify.put<{ Params: { id: string }; Body: Omit<Transaction, "id" | "date"> }>("/transactions/:id", { schema: { body: transactionSchema } }, (request, reply) => {
    const txId = Number(request.params.id);
    const index = transactions.findIndex(t => t.id === txId);
    if (index === -1) return reply.code(404).send(`Transaction not found for Id: ${txId}`);

    const { amount, type, category, description } = request.body;

    const transaction: Transaction = {
      id: txId,
      amount,
      type,
      category,
      description,
      date: new Date().toISOString()
    };

    transactions[index] = transaction;
    return reply.send(transaction);
  });

  // Delete a transaction by ID
  fastify.delete<{ Params: { id: string } }>("/transactions/:id", async (request, reply) => {
    const txId = Number(request.params.id);
    const index = transactions.findIndex(t => t.id === txId);
    if (index === -1) return reply.code(404).send(`Transaction not found for Id: ${txId}`);

    transactions.splice(index, 1);
    return reply.send("Deleted successfully");
  });

  // Get summary of transactions by category
  fastify.get("/summary", async () => {
    const summary = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { income: 0, expense: 0 };
      }
      acc[transaction.category][transaction.type] += transaction.amount;
      return acc;
    }, {});
    return summary;
  });

  // Reset all transactions
  fastify.post("/reset", (_, reply) => {
    transactions.splice(0, transactions.length);
    return reply.send("All transactions have been reset");
  });

  return fastify;
}
