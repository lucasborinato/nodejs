import express, { Request, Response } from 'express';
import { buildResponse } from '../infra/buildResponse';
import ValidateJWTMiddleware from '../infra/validate-jwt.middleware';
import { FatorConversao } from '../models/fator-conversao';
import { Produto } from '../models/produto';
import { IProdutoSaida, ProdutoSaida } from '../models/produto-saida';


const router = express.Router()

router.post('/api/produtos-saida', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {

        if (!req.body.produtoId) {
            throw 'Campo "produtoId" precisa ser informado';
        }

        if (!req.body.fatorConversaoId) {
            throw 'Campo "fatorConversaoId" precisa ser informado';
        }

        if (!req.body.quantidade) {
            throw 'Campo "quantidade" precisa ser informado';
        }

        let body = req.body;

        let produto;
        try {
            produto = await Produto.findOne({ '_id': body.produtoId });
        } catch {
            throw 'Produto não encontrado';
        }

        let fatorConversao;
        try {
            fatorConversao = await FatorConversao.findOne({ '_id': body.fatorConversaoId });
        } catch {
            throw 'Fator conversão não encontrado';
        }

        const produtoSaida: IProdutoSaida = new ProdutoSaida({
            produto,
            fatorConversao,
            quantidade: body.quantidade
        });

        await produtoSaida.save();
        buildResponse(res, { msg: 'Produto saída incluído com sucesso' });

    } catch (err) {
        console.log('erro', err);

        buildResponse(res, { err });
    }
});

router.get('/api/produtos-saida', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        const produtosSaida = await ProdutoSaida.find();
        buildResponse(res, { dados: produtosSaida });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/produtos-saida/:produtoSaidaId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        let produtoSaida;
        try {
            produtoSaida = await ProdutoSaida.findOne({ '_id': req.params.produtoSaidaId });

            if (!produtoSaida) {
                throw 'Produto saída não encontrado';
            }
        } catch {
            throw 'Produto saída não encontrado';
        }

        buildResponse(res, { dados: produtoSaida });

    } catch (err) {
        buildResponse(res, { err });
    }
});

router.delete('/api/produtos-saida/:produtoSaidaId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        try {
            const produtoSaida = await ProdutoSaida.deleteOne({ '_id': req.params.produtoSaidaId })

            if (produtoSaida && (produtoSaida as any).deletedCount === 0) {
                throw 'Produto saida não encontrado';
            }
        } catch {
            throw 'Produto saída não encontrado';
        }

        buildResponse(res, { msg: 'Produto saída excluído com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.put('/api/produtos-saida/:produtoSaidaId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {

        if (!req.body.produtoId) {
            throw 'Campo "produtoId" precisa ser informado';
        }

        if (!req.body.fatorConversaoId) {
            throw 'Campo "fatorConversaoId" precisa ser informado';
        }

        if (!req.body.quantidade) {
            throw 'Campo "quantidade" precisa ser informado';
        }

        let body = req.body;

        let produto;
        try {
            produto = await Produto.findOne({ '_id': body.produtoId });
            body.produto = produto;
        } catch {
            throw 'Produto não encontrado';
        }

        let fatorConversao;
        try {
            fatorConversao = await FatorConversao.findOne({ '_id': body.fatorConversaoId });
            body.fatorConversao = fatorConversao;
        } catch {
            throw 'Fator conversão não encontrado';
        }

        try {
            const produtoSaida = await ProdutoSaida.updateOne({ '_id': req.params.produtoSaidaId }, body);
            if (produtoSaida && (produtoSaida as any).ok === 0) {
                throw 'Produto saída não encontrado';
            }
        } catch {
            throw 'Produto saída não encontrado';
        }

        buildResponse(res, { msg: 'Produto atualizado com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

export { router as produtoSaidaRouter };
