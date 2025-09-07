const fastify = require('fastify')();

const transactions = [];

// schema
const transactionSchema = {
  type: 'object',
  required: ['amount', 'type', 'category'],
  properties: {
    id: { type: 'number' },
    amount: { type: 'number' },
    type: { type: 'string', enum: ['income', 'expense'] },
    category: { type: 'string' },
    description: { type: 'string' },
    date: { type: 'string', format: 'date-time' }
  }
};

// Endpoints
// Create a new transaction
fastify.post('/transactions', { schema: { body: transactionSchema } }, (request, reply) => {
    const { amount, type, category, description } = request.body;
    const totalTransactions = transactions.length;
    let txId = totalTransactions == 0 ? 1 : Number(transactions[totalTransactions - 1].id) + 1;
    
    const transaction = {
        id: txId,
        amount,
        type,
        category,
        description: description || '',
        date: new Date().toISOString()
    };
    transactions.push(transaction);
    reply.send(transaction);
});

// Get all transactions
fastify.get('/transactions', async () =>  { return transactions; });

// Get a transaction by ID
fastify.get('/transactions/:id', async (request, reply) => {
    const txId = request.params.id;
    const transaction = transactions.find(t => t.id == txId);
    if(!transaction) {
        return reply.code(404).send(`Transcation not found for Id : ${txId}`);
    }
    return transaction; 
});

// Update a transaction by ID
fastify.put('/transactions/:id', { schema: { body: transactionSchema } }, (request, reply) => {
    const txId = request.params.id;
    const index = transactions.findIndex(t => t.id == txId);
    if(index == -1) {
        return reply.code(404).send(`Transcation not found for Id : ${txId}`);
    }
    const { amount, type, category, description } = request.body;
    
    const transaction = {
        id: txId,
        amount,
        type,
        category,
        description,
        date: new Date().toISOString()
    };

    transactions[index] = transaction;
    return reply.send(transactions[index]);
});

// Delete a transaction by ID
fastify.delete('/transactions/:id', async (request, reply) => {
    const txId = request.params.id;
    const index = transactions.findIndex(t => t.id == txId);
    if(index == -1) {
        return reply.code(404).send(`Transcation not found for Id : ${txId}`);
    }

    transactions.splice(index, 1);
    return reply.send(`Deleted successfully`);
});

// Get summary of transactions by category
fastify.get('/summary', async () => {
    const summary = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
            acc[transaction.category] = { income: 0, expense: 0 };
        }
        acc[transaction.category][transaction.type] += transaction.amount;
        return acc;
    }, {});
    return summary;
});

// Reset all transactions
fastify.post('/reset', (_, reply) => {
    transactions.splice(0, transactions.length);
    return reply.send('All transactions have been reset');
});

module.exports = fastify;