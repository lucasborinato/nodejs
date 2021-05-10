import { json } from 'body-parser';
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { fatorConversaoRouter } from './routes/fator-conversao';
import { produtoRouter } from './routes/produto';
import { produtoEntradaRouter } from './routes/produto-entrada';
import { usuarioRouter } from './routes/usuario';


export let ObjectId = mongoose.Types.ObjectId;

const app = express();
app.use(json());
dotenv.config();


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use(usuarioRouter);
app.use(fatorConversaoRouter);
app.use(produtoRouter);
app.use(produtoEntradaRouter);

const stringDeConexao =
    `mongodb://${process.env.MONGO_IP}:27017/${process.env.BD}`;

mongoose.connect(stringDeConexao, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to database', process.env.BD);

    app.listen(process.env.API_PORT, () => {
        console.log('server ins listening on port', process.env.API_PORT);
    });
}).catch(err => {
    console.error('Erro ao efetuar conexão com o banco de dados');
    console.error('String de conexão', stringDeConexao);
    console.error(err);
});
