import { NextFunction, Request, Response } from 'express';
import jsonWebToken, { Secret } from 'jsonwebtoken';

/**
 * Middleware resopnsável por validar o JWT passado no header
 * Authorization.
 * @param req Objeto request
 * @param res Objeto response
 * @param next NextFunction para passar para o próximo middleware ou rota
 */
function ValidateJWTMiddleware(req: Request, res: Response, next: NextFunction) {
    const jwt = req.headers['authorization'] as string;
    const chavePrivada = (process.env.SECRET as Secret);

    // Efetuando a validação do JWT:
    jsonWebToken.verify(jwt, chavePrivada, (err, jwtPayload) => {
        if (err) {
            console.error('JWT inválido', err);
            res
                .status(403)
                .end('JWT Inválido');
            return;
        }

        (req as any).session = jwtPayload;
        next();
    });
}

export default ValidateJWTMiddleware;