import express from 'express'
import mongoose from 'mongoose'
import { json } from 'body-parser'
import * as dotenv from 'dotenv';

import { produtoRouter } from './routes/produto';
import { usuarioRouter } from './routes/usuario';

const app = express();
app.use(json());
dotenv.config();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use(produtoRouter);
app.use(usuarioRouter);

mongoose.connect(`mongodb://${process.env.MONGO_IP}:27017/${process.env.BD}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to database', process.env.BD)
})

app.listen(process.env.API_PORT, () => {
    console.log('server ins listening on port', process.env.API_PORT);
});