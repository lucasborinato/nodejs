import mongoose, { Document, Model } from 'mongoose';

interface IFatorConversao extends Document {
    descricao: string;
    multiplicador: number;
}

const collection: string = 'fator-conversao';

const todoSchema = new mongoose.Schema({
    descricao: { type: String, required: true },
    multiplicador: { type: Number, required: true }
});

const FatorConversao: Model<IFatorConversao> = mongoose.model(collection, todoSchema, collection);

export { FatorConversao, IFatorConversao }