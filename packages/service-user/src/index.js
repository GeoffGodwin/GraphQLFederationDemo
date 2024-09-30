import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import fetch from 'node-fetch';

const typeDefs = gql`
  extend type Query {
    users: [User]
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    yearsOfService: Float
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const response = await fetch('http://localhost:3001/users');
      return response.json();
    },
  },
  User: {
    __resolveReference(user) {
      return fetch(`http://localhost:3001/users/${user.id}`).then(res => res.json());
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: 4001 },
}).then(({ url }) => {
  console.log(`User service running at ${url}`);
});