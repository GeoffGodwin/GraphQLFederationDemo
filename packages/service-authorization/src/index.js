import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import fetch from 'node-fetch';

// Define the schema
const typeDefs = gql`
  extend type User @key(fields: "id") {
    id: ID! @external
    name: String @external
    authorizations: [Authorization] @requires(fields: "id")
  }

  type Authorization {
    id: ID!
    permission: String
  }
`;

const resolvers = {
    User: {
      // The parent 'user' object contains 'id' and 'name' from the base User type. It also contains yearsOfService but as that's not mandatory to determine Authorizations, we can ignore it.
      authorizations: async (user) => {
        if (!user || !user.id) {
            // User does not exist
            return [];
          }
        // Use the user's ID to fetch authorizations. We could also use the user's name here if we wanted to because it's references in teh User type above. We cannot use the yearsOfService unless we add it to the type above.
        // This is important because it means the owner of THIS GraphQL service doesn't need to constantly update the User object Type in their file whenever new fields are added to the external User type.
        const response = await fetch(`http://localhost:3003/authorizations/${user.id}`);
        
        if (response.status === 200) {
            return response.json();
          } else {
            // Return an empty array if no authorizations are found
            return [];
          }
      },
    },
  };

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });
  
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4003 },
  });
  
  console.log(`Authorization service running at ${url}`);