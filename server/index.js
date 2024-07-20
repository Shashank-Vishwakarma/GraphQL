const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const axios = require('axios');

// type definitions
const typedefs = `#graphql
    type Todo {
        id: ID!
        title: String!
        completed: Boolean
        userId: ID!
        # user: User
    }

    type Geo {
        lat: String!
        lng: String!
    }

    type Address {
        street: String!
        suite: String!
        city: String!
        zipcode: String!
        geo: Geo
    }

    type Company {
        name: String!
        catchPhrase: String!
        bs: String!
    }

    type User {
        id: String!
        name: String!
        username: String!
        email: String
        address: Address
        phone: String
        website: String
        company: Company
    }

    type Query {
        todos: [Todo]
        users: [User]
        getUser(id: String!): User
    }
`;

// resolvers to manipulate data on query or mutation
const resolvers = {
    // Todo: {
    //     user: async (todoParent) => {
    //         const data = await axios.get(`https://jsonplaceholder.typicode.com/users/${todoParent.userId}`);
    //         return data.data
    //     }
    // },
    Query: {
        todos: async () => {
            // return todos;
            const data = await axios.get('https://jsonplaceholder.typicode.com/todos')
            return data.data
        },
        users: async () => {
            const data = await axios.get('https://jsonplaceholder.typicode.com/users');
            return data.data
        },
        getUser: async (parent, { id }) => {
            const data = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
            return data.data
        }
    }
};

async function startServer() {
    const app = express();

    // cors setup
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));

    app.use(express.json());

    const server = new ApolloServer({
        typeDefs: typedefs,
        resolvers: resolvers
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.listen(3000, () => {
        console.log("Server started at port 3000");
    });
}

startServer();