import mongoose, { Document, Model } from 'mongoose';

interface IProdutoEntrada extends Document {
    produto: any;
    fatorConversao: any;
    quantidade: number;
}

const collection: string = 'produto-entrada';

const todoSchema = new mongoose.Schema({
    produto: { type: Object, required: true },
    fatorConversao: { type: Object, required: true },
    quantidade: { type: Number, required: true }
});

const ProdutoEntrada: Model<IProdutoEntrada> = mongoose.model(collection, todoSchema, collection);

export { ProdutoEntrada, IProdutoEntrada }