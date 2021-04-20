import { buildResponse } from '../infra/buildResponse';
import express , { Request, Response } from 'express';
import { IProduto, Produto } from '../models/produto';
import { validarToken } from '../infra/auth';

const router = express.Router()

router.post('/api/produto', async(req: Request, res: Response) => {
    try {
        await validarToken(req);

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
        buildResponse(res, { msg: 'Produto incluído com sucesso' });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/produto', async(req: Request, res: Response) => {
    try {
        await validarToken(req);

        const produtos = await Produto.find();
        buildResponse(res, { dados: produtos });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.get('/api/produto/:produtoId', async(req: Request, res: Response) => {
    try {
        await validarToken(req);

        await Produto.findOne({ '_id': req.params.produtoId })
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

router.delete('/api/produto/:produtoId', async(req: Request, res: Response) => {
    try {
        await validarToken(req);

        await Produto.deleteOne({ '_id': req.params.produtoId })
            .then(dados => {
                if(dados?.deletedCount?.toString() == '0') {
                    buildResponse(res, { msg: 'Produto não encontrado' });
                } else {
                    buildResponse(res, { msg: 'Produto excluído com sucesso' });
                }
            })
            .catch(_ => { 
                buildResponse(res, { msg: 'Produto não encontrado' });
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

router.put('/api/produto/:produtoId', async(req: Request, res: Response) => {
    try {
        await validarToken(req);

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
            .then(_ => {
                buildResponse(res, { msg: 'Produto atualizado com sucesso' });
            })
            .catch(_ => { 
                buildResponse(res, null);
            });
    } catch (err) {
        buildResponse(res, { err });
    }
});

export { router as produtoRouter }