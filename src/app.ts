import Fastify from "fastify";
import transactionsRoutes from "./routes/transactions";

const buildApp = () => {
  const fastify = Fastify();
  fastify.register(transactionsRoutes);
  return fastify;
};

export default buildApp;
