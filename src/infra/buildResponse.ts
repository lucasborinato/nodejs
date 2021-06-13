import { Response } from "express";

function buildResponse(res: Response, entrada: any) {
    let saida: any = {};
    let httpStatus: number = 200;

    if (entrada != null && 'erro' in entrada) {
        saida.mensagem = 'Ocorreu um erro interno. Por favor, repita a operação e se o problema persistir entre em contato com a equipe de suporte';
        httpStatus = 500;
    }

    if (entrada == null || (entrada.dados == null && !(entrada.msg))) {
        httpStatus = 404;
    }

    if (entrada?.err) {
        saida.mensagem = entrada.err;
        httpStatus = 422;
    }

    if (entrada?.msg) {
        saida.mensagem = entrada.msg;
    }

    if (entrada?.dados) {
        saida = entrada.dados;
    }

    return res.status(httpStatus).json(saida);
};

export { buildResponse };
