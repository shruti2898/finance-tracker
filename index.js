const awsLambdaFastify = require('@fastify/aws-lambda');
const app = require('./app');

exports.handler = awsLambdaFastify(app);