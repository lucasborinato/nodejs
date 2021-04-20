import mongoose, { Document, Model } from 'mongoose';

interface IUsuario extends Document {
    login: string;
    senha: string;
    nome: string;
    email: string;
}

const collection: string = 'usuario';

const todoSchema = new mongoose.Schema({
    login: { type: String, required: true },
    senha: { type: String, required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true }        
});

const Usuario: Model<IUsuario> = mongoose.model(collection, todoSchema, collection);

export { Usuario, IUsuario }