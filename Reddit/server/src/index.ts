require('dotenv').config()
import 'reflect-metadata'

import express from 'express';
import { createConnection } from 'typeorm'
import { User } from './entities/User';
import { Post } from './entities/Post';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { UserResolver } from './resolvers/user';
import mongoose from 'mongoose'
import { COOKIE_NAME, __prod__ } from './utils/constants'
import { Context } from './types/Context';
import { PostResolver } from './resolvers/post';

const session = require('express-session');
const MongoStore = require('connect-mongo');

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'reddit',
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        logging: true,
        synchronize: true,
        entities: [User, Post]
    })

    const app = express()

    const mongoURL = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@reddit.krfjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    // Session/cookie store
    await mongoose.connect(mongoURL, {
        // useCreateIndex: true,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false
    })


    
    console.log('Mongodb connected')
    
    app.use(session({
        name: COOKIE_NAME,
        store: MongoStore.create({ mongoUrl: mongoURL }),
        cookie: {
            maxAge: 1000 * 60 * 60, // one hour,
            httpOnly: true, // js frontend cannot access the cookie
            secure: __prod__,
            sameSite: 'lax' // protection againt CSRF
        },
        secret: process.env.SESSION_SECRET_DEV_PROD as string,
        saveUninitialized: false, // don't save empty session, right from the start
        resave: false
    }));

    const apolloServer = new ApolloServer({
        schema: await buildSchema({ resolvers: [HelloResolver, UserResolver, PostResolver], validate: false }),
        context: ({ req, res }): Context => ({ req, res }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({ app, cors: false })
    const PORT = process.env.PORT || 4000

    app.listen(PORT, () =>  console.log(`Server is listening on port ${PORT}, GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`))
}

main().catch(error => console.log(error))