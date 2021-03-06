import express, { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import { buildResponse } from '../infra/buildResponse';
import ValidateJWTMiddleware from '../infra/validate-jwt.middleware';
import { IUsuario, Usuario } from '../models/usuario';

const router = express.Router()

router.post('/api/usuarios/login', async (req: Request, res: Response) => {
    try {
        if (!req.body.login) {
            throw 'Campo "login" precisa ser informado';
        }

        if (!req.body.senha) {
            throw 'Campo "senha" precisa ser informado';
        }

        const body = req.body;
        const dados = await Usuario.findOne({
            login: body.login,
            senha: body.senha
        });

        if (!dados) {
            throw 'Usuário e/ou senha inválido(s)';
        }

        const token = jwt.sign({
            login: dados?.login,
            nome: dados?.nome,
            email: dados?.email
        }, (process.env.SECRET as Secret), {
            expiresIn: 86400 // Tempo de expiracao token
        });

        buildResponse(res, { dados: { token } });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.post('/api/usuarios/logout', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        buildResponse(res, { dados: {} });
    } catch (err) {
        buildResponse(res, { err });
    }
})

router.post('/api/usuarios', async (req: Request, res: Response) => {
    try {
        if (!req.body.login) {
            throw 'Campo "login" precisa ser informado';
        }

        if (!req.body.senha) {
            throw 'Campo "senha" precisa ser informado';
        }

        if (!req.body.nome) {
            throw 'Campo "nome" precisa ser informado';
        }

        if (!req.body.email) {
            throw 'Campo "e-mail" precisa ser informado';
        }

        const body: IUsuario = req.body;
        const dados = await Usuario.findOne({ 'login': body.login });

        if (dados) {
            throw 'Login já está sendo utilizado. Por favor informar outro Login';
        }

        const usuario: IUsuario = new Usuario({
            login: body.login,
            senha: body.senha,
            nome: body.nome,
            email: body.email
        });

        await usuario.save();
        buildResponse(res, { msg: 'Usuário incluído com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/usuarios', async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.find({}, { _id: 0, login: 1, email: 1 });
        buildResponse(res, { dados: usuarios });
    } catch (error) {
        return res.send(`Erro ao consultar Usuario: ${error}`);
    }
});

router.get('/api/usuarios/:usuarioId', async (req: Request, res: Response) => {
    try {
        await Usuario.findOne({ '_id': req.params.usuarioId }, { _id: 0, login: 1, email: 1 })
            .then(dados => {
                buildResponse(res, { dados });
            })
            .catch(_ => {
                buildResponse(res, null);
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.delete('/api/usuarios/:usuarioId', async (req: Request, res: Response) => {
    try {
        await Usuario.deleteOne({ '_id': req.params.usuarioId })
            .then(dados => {
                if (dados?.deletedCount?.toString() == '0') {
                    buildResponse(res, { msg: 'Usuário não encontrado' });
                } else {
                    buildResponse(res, { msg: 'Usuário excluído com sucesso' });
                }
            })
            .catch(error => {
                throw error;
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.put('/api/usuarios/:usuarioId', async (req: Request, res: Response) => {
    try {

        if (!req.body.login) {
            throw 'Campo "login" precisa ser informado';
        }

        if (!req.body.senha) {
            throw 'Campo "senha" precisa ser informado';
        }

        if (!req.body.nome) {
            throw 'Campo "nome" precisa ser informado';
        }

        if (!req.body.email) {
            throw 'Campo "e-mail" precisa ser informado';
        }

        await Usuario.updateOne({ '_id': req.params.usuarioId }, req.body)
            .then(_ => {
                buildResponse(res, { msg: 'Usuário atualizado com sucesso' });
            })
            .catch(_ => {
                buildResponse(res, null);
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

export { router as usuarioRouter }