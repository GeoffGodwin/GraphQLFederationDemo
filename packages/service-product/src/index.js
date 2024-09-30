import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import fetch from 'node-fetch';

const typeDefs = gql`
  extend type Query {
    products: [Product]
  }

  type Product @key(fields: "id") {
    id: ID!
    name: String
    price: Int
  }
`;

const resolvers = {
  Query: {
    products: async () => {
      const response = await fetch('http://localhost:3002/products');
      return response.json();
    },
  },
  Product: {
    __resolveReference(product) {
      return fetch(`http://localhost:3002/products/${product.id}`).then(res => res.json());
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: 4002 },
}).then(({ url }) => {
  console.log(`Product service running at ${url}`);
});