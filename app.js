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

fastify.get('/api', (_, reply) => {
    reply.send("Welcome to finance tracker");
})

fastify.get('/api/transactions', async () =>  { return transactions; });

fastify.post('/api/transactions', { schema: { body: transactionSchema } }, (request, reply) => {
    const { amount, type, category, description } = request.body;
    const totalTransactions = transactions.length;
    let txId = totalTransactions == 0 ? 1 : transactions[totalTransactions - 1].id + 1;
    
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

fastify.put('/api/transactions/:id', { schema: { body: transactionSchema } }, (request, reply) => {
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
        description: description
    };

    transactions[txId] = transaction;
    return reply.send(transactions[txId]);
});

fastify.delete('/api/transactions/:id', async (request, reply) => {
    const txId = request.params.id;
    const index = transactions.findIndex(t => t.id === txId);
    if(index == -1) {
        return reply.code(404).send(`Transcation not found for Id : ${txId}`);
    }

    transactions.splice(index, 1);
    return reply.send(`Deleted successfully`);
});

module.exports = fastify;
