import express from 'express'
import mongoose from 'mongoose'
import { json } from 'body-parser'
import { produtoRouter } from './routes/produto';

const app = express();
app.use(json());
app.use(produtoRouter);

mongoose.connect('mongodb://localhost:27017/adega', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to database')
})

app.listen(3000, () => {
    console.log('server ins listening on port 3000')
});