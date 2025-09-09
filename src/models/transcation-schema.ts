export const transactionSchema = {
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