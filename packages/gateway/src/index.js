import { ApolloServer } from '@apollo/server';
import { ApolloGateway } from '@apollo/gateway';
import { startStandaloneServer } from '@apollo/server/standalone';

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'user', url: 'http://localhost:4001/graphql' },
    { name: 'product', url: 'http://localhost:4002/graphql' },
    { name: 'authorization', url: 'http://localhost:4003/graphql' }
  ],
});

const server = new ApolloServer({
  gateway,
  // Subscriptions are not supported yet when using Apollo Federation
  subscriptions: false,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Gateway running at ${url}`);
});