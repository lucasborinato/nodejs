import { buildResponse } from '../infra/buildResponse';
import express , { Request, Response } from 'express';
import { IProduto, Produto } from '../models/produto';

const router = express.Router()

router.post('/api/produto', async(req: Request, res: Response) => {
    try {
        if(!req.body.descricao) {
            throw 'Campo "descricao" precisa ser informado';
        }

        if(!req.body.peso) {
            throw 'Campo "peso" precisa ser informado';
        }

        if(!req.body.valor) {
            throw 'Campo "valor" precisa ser informado';
        }

        const body = req.body;

        const produto: IProduto  = new Produto({
            descricao: body.descricao,
            peso: body.peso,
            valor: body.valor
        });

        await produto.save();
        buildResponse(res, { msg: 'Incluiu Produto' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/produto', async(req: Request, res: Response) => {
    try {
        const produtos = await Produto.find();
        buildResponse(res, { dados: produtos });
    } catch (error) {
        return res.send(`Erro ao consultar Produto: ${error}`);
    }
});

router.get('/api/produto/:produtoId', async(req: Request, res: Response) => {
    try {
        await Produto.findOne({ '_id': req.params.produtoId })
            .then(produto => {
                buildResponse(res, { dados: produto });
            })
            .catch(_ => { 
                buildResponse(res, null);
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.delete('/api/produto/:produtoId', async(req: Request, res: Response) => {
    try {
        await Produto.deleteOne({ '_id': req.params.produtoId })
            .then(produto => {
                if(produto?.deletedCount?.toString() == '0') {
                    buildResponse(res, null);
                } else {
                    buildResponse(res, { msg: 'Produto excluído' });
                }
            })
            .catch(_ => { 
                console.log('erro ao deletar');

                buildResponse(res, null);
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.put('/api/produto/:produtoId', async(req: Request, res: Response) => {
    try {

        if(!req.body.descricao) {
            throw 'Campo "descricao" precisa ser informado';
        }

        if(!req.body.peso) {
            throw 'Campo "peso" precisa ser informado';
        }

        if(!req.body.valor) {
            throw 'Campo "valor" precisa ser informado';
        }

        await Produto.updateOne({ '_id': req.params.produtoId }, req.body)
            .then(produto => {
                buildResponse(res, { msg: 'Produto atualizado' });
            })
            .catch(_ => { 
                buildResponse(res, null);
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

export { router as produtoRouter }