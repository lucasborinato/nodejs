import mongoose, { Document, Model } from 'mongoose';

interface IProdutoSaida extends Document {
    produto: any;
    fatorConversao: any;
    quantidade: number;
}

const collection: string = 'produto-saida';

const todoSchema = new mongoose.Schema({
    produto: { type: Object, required: true },
    fatorConversao: { type: Object, required: true },
    quantidade: { type: Number, required: true }
});

const ProdutoSaida: Model<IProdutoSaida> = mongoose.model(collection, todoSchema, collection);

export { ProdutoSaida, IProdutoSaida };
