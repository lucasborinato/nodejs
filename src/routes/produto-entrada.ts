import express, { Request, Response } from 'express';
import { buildResponse } from '../infra/buildResponse';
import ValidateJWTMiddleware from '../infra/validate-jwt.middleware';
import { FatorConversao } from '../models/fator-conversao';
import { Produto } from '../models/produto';
import { IProdutoEntrada, ProdutoEntrada } from '../models/produto-entrada';


const router = express.Router()

router.post('/api/produtos-entrada', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {

        if (!req.body.produto) {
            throw 'Campo "produto" precisa ser informado';
        }

        if (!req.body.fatorConversao) {
            throw 'Campo "fator conversão" precisa ser informado';
        }

        if (!req.body.quantidade) {
            throw 'Campo "quantidade" precisa ser informado';
        }

        let body = req.body;

        let produto;
        try {
            produto = await Produto.findOne({ '_id': body.produto });
        } catch {
            throw 'Produto não encontrado';
        }

        let fatorConversao;
        try {
            fatorConversao = await FatorConversao.findOne({ '_id': body.fatorConversao });
        } catch {
            throw 'Fator conversão não encontrado';
        }

        const produtoEntrada: IProdutoEntrada = new ProdutoEntrada({
            produto,
            fatorConversao,
            quantidade: body.quantidade
        });

        await produtoEntrada.save();
        buildResponse(res, { msg: 'Produto entrada incluído com sucesso' });

    } catch (err) {
        console.log('erro', err);

        buildResponse(res, { err });
    }
});

router.get('/api/produtos-entrada', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        const produtosEntrada = await ProdutoEntrada.find();
        buildResponse(res, { dados: produtosEntrada });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/produtos-entrada/:produtoEntradaId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        let produtoEntrada;
        try {
            produtoEntrada = await ProdutoEntrada.findOne({ '_id': req.params.produtoEntradaId });

            if (!produtoEntrada) {
                throw 'Produto entrada não encontrado';
            }
        } catch {
            throw 'Produto entrada não encontrado';
        }

        buildResponse(res, { dados: produtoEntrada });

    } catch (err) {
        buildResponse(res, { err });
    }
});

router.delete('/api/produtos-entrada/:produtoEntradaId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {
        try {
            const produtoEntrada = await ProdutoEntrada.deleteOne({ '_id': req.params.produtoEntradaId })

            if (produtoEntrada && (produtoEntrada as any).deletedCount === 0) {
                throw 'Produto entrada não encontrado';
            }
        } catch {
            throw 'Produto entrada não encontrado';
        }

        buildResponse(res, { msg: 'Produto excluído com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.put('/api/produtos-entrada/:produtoEntradaId', ValidateJWTMiddleware, async (req: Request, res: Response) => {
    try {

        if (!req.body.produto) {
            throw 'Campo "produto" precisa ser informado';
        }

        if (!req.body.fatorConversao) {
            throw 'Campo "fator conversão" precisa ser informado';
        }

        if (!req.body.quantidade) {
            throw 'Campo "quantidade" precisa ser informado';
        }

        let body = req.body;

        let produto;
        try {
            produto = await Produto.findOne({ '_id': body.produto });
            body.produto = produto;
        } catch {
            throw 'Produto não encontrado';
        }

        let fatorConversao;
        try {
            fatorConversao = await FatorConversao.findOne({ '_id': body.fatorConversao });
            body.fatorConversao = fatorConversao;
        } catch {
            throw 'Fator conversão não encontrado';
        }

        const produtoEntrada = await ProdutoEntrada.updateOne({ '_id': req.params.produtoEntradaId }, body);
        if (produtoEntrada && (produtoEntrada as any).nModified === 0) {
            throw 'Produto entrada não encontrado';
        }

        buildResponse(res, { msg: 'Produto atualizado com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

export { router as produtoEntradaRouter };
