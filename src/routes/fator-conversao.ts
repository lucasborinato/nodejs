import express, { Request, Response } from 'express';

import { buildResponse } from '../infra/buildResponse';
import ValidateJWTMiddleware from '../infra/validate-jwt.middleware';
import { FatorConversao, IFatorConversao } from '../models/fator-conversao';

const router = express.Router()

router.post('/api/fatoresConversao', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {

        if (!req.body.descricao) {
            throw 'Campo "descricao" precisa ser informado';
        }

        if (!req.body.multiplicador) {
            throw 'Campo "multiplicador" precisa ser informado';
        }

        const body = req.body;

        const fatorConversao: IFatorConversao = new FatorConversao({
            descricao: body.descricao,
            multiplicador: body.multiplicador
        });

        await fatorConversao.save();
        buildResponse(res, { msg: 'Fator conversão incluído com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/fatoresConversao', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        const fatoresConversao = await FatorConversao.find();
        buildResponse(res, { dados: fatoresConversao });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/fatoresConversao/:fatorConversaoId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        const dados = await FatorConversao.findOne({
            '_id': req.params.fatorConversaoId
        });

        buildResponse(res, { dados });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.delete('/api/fatoresConversao/:fatorConversaoId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        const dados = await FatorConversao.deleteOne({
            '_id': req.params.fatorConversaoId
        });

        if (dados?.deletedCount?.toString() == '0') {
            buildResponse(res, { msg: 'FatorConversao não encontrado' });
        } else {
            buildResponse(res, { msg: 'FatorConversao excluído com sucesso' });
        }

    } catch (err) {
        buildResponse(res, { err });
    }
});

router.put('/api/fatoresConversao/:fatorConversaoId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        if (!req.body.descricao) {
            throw 'Campo "descricao" precisa ser informado';
        }

        if (!req.body.multiplicador) {
            throw 'Campo "multiplicador" precisa ser informado';
        }

        await FatorConversao.updateOne(
            { '_id': req.params.fatorConversaoId },
            req.body
        );

        buildResponse(res, { msg: 'FatorConversao atualizado com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

export { router as fatorConversaoRouter }