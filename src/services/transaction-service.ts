import { docClient } from "../utils/dynamoDbClient";
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "transactions";

export async function createTransaction(data: any) {
  const transaction = {
    id: Date.now(),
    ...data,
    date: new Date().toISOString()
  };

  await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: transaction }));
  return transaction;
}

export async function getAllTransactions() {
  const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
  return result.Items || [];
}

export async function getTransactionById(id: number) {
  const result = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
  return result.Item;
}

export async function updateTransaction(id: number, data: any) {
  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "SET amount = :a, #t = :t, category = :c, description = :d, #dt = :dt",
      ExpressionAttributeNames: { "#t": "type", "#dt": "date" },
      ExpressionAttributeValues: {
        ":a": data.amount,
        ":t": data.type,
        ":c": data.category,
        ":d": data.description,
        ":dt": new Date().toISOString()
      },
      ReturnValues: "ALL_NEW"
    })
  );
  return result.Attributes;
}

export async function deleteTransaction(id: number) {
  await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
}

export async function getSummary() {
  const result = await getAllTransactions();
  return result.reduce((acc: any, tx: any) => {
    if (!acc[tx.category]) {
      acc[tx.category] = { income: 0, expense: 0 };
    }
    acc[tx.category][tx.type] += tx.amount;
    return acc;
  }, {});
}
