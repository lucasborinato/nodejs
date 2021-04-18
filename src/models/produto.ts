import mongoose, { Document, Model } from 'mongoose';

interface IProduto extends Document {
    descricao: string;
    peso: string;
    valor: string;
}

const collection: string = 'produto';

const todoSchema = new mongoose.Schema({
    descricao: { type: String, required: true },
    peso: { type: String, required: true },
    valor: { type: String, required: true }    
});

const Produto: Model<IProduto> = mongoose.model(collection, todoSchema, collection);

export { Produto, IProduto }