import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import fetch from 'node-fetch';

const typeDefs = gql`
  extend type Query {
    users: [User]
    user(id: ID, name: String): User
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
    // Wanted to show two different ways of handling the API response back based on if the API is capable of filtering logic or not.
    // In the first instance we have a lookup by user ID. This uses the users/:id endpoint. In the second instance we have a lookup by user name. 
    // This uses the users endpoint and then filters the response here in graphQL. The first should be used whenever possible, but the second is a backup strategy when "prioritization" gets in the way.
    user: async (_, args) => {
      if (args.id) {
        const response = await fetch(`http://localhost:3001/users/${args.id}`);
        return response.json();
      } else if (args.name) {
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        return users.find((user) => user.name === args.name);
      }
      return null;
    },
  },
  User: {
    __resolveReference: async (user) => {
      const response = await fetch(`http://localhost:3001/users/${user.id}`);
      return response.json();
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