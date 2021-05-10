import express, { Request, Response } from 'express';
import { buildResponse } from '../infra/buildResponse';
import ValidateJWTMiddleware from '../infra/validate-jwt.middleware';
import { FatorConversao, IFatorConversao } from '../models/fator-conversao';
import { IProduto, Produto } from '../models/produto';


const router = express.Router()

router.post('/api/produtos', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {

        if (!req.body.descricao) {
            throw 'Campo "descricao" precisa ser informado';
        }

        if (!req.body.peso) {
            throw 'Campo "peso" precisa ser informado';
        }

        if (!req.body.valor) {
            throw 'Campo "valor" precisa ser informado';
        }

        if (!req.body.fatoresConversao) {
            throw 'Campo "fatoresConversao" precisa ser informado';
        }

        let body = req.body;

        FatorConversao.find({
            '_id': { $in: body.fatoresConversao }
        }, async (error, success: IFatorConversao[]) => {

            if (error) {
                throw error;
            }

            body.fatoresConversao = success;

            const produto: IProduto = new Produto({
                descricao: body.descricao,
                peso: body.peso,
                valor: body.valor,
                fatoresConversao: body.fatoresConversao
            });

            await produto.save();
            buildResponse(res, { msg: 'Produto incluído com sucesso' });
        });


    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/produtos', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        const produtos = await Produto.find();
        buildResponse(res, { dados: produtos });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/produtos/:produtoId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        let produto;
        try {
            produto = await Produto.findOne({ '_id': req.params.produtoId });
            if (!produto) {
                throw 'Produto não encontrado';
            }
        } catch {
            throw 'Produto não encontrado';
        }

        buildResponse(res, { dados: produto });

    } catch (err) {
        buildResponse(res, { err });
    }
});

router.delete('/api/produtos/:produtoId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        try {
            const produto = Produto.deleteOne({ '_id': req.params.produtoId });
            if (produto && (produto as any).deletedCount === 0) {
                throw 'Produto não encontrado';
            }
        } catch {
            throw 'Produto não encontrado';
        }

        buildResponse(res, { msg: 'Produto excluído com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.put('/api/produtos/:produtoId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {

        if (!req.body.descricao) {
            throw 'Campo "descricao" precisa ser informado';
        }

        if (!req.body.peso) {
            throw 'Campo "peso" precisa ser informado';
        }

        if (!req.body.valor) {
            throw 'Campo "valor" precisa ser informado';
        }

        if (!req.body.fatoresConversao) {
            throw 'Campo "fatoresConversao" precisa ser informado';
        }

        let body = req.body;

        let fatoresConversao = await FatorConversao.find({
            '_id': { $in: body.fatoresConversao }
        });

        if (!fatoresConversao) {
            throw 'Fatores de conversão não encontrados';
        }

        body.fatoresConversao = fatoresConversao;

        try {
            let produto = await Produto.findOne({ '_id': req.params.produtoId });
            if (!produto) {
                throw 'Produto não encontrado';
            }
        } catch {
            throw 'Produto não encontrado';
        }

        await Produto.updateOne({ '_id': req.params.produtoId }, body);
        buildResponse(res, { msg: 'Produto atualizado com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

export { router as produtoRouter };
