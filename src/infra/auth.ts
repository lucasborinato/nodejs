import { Request } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { Usuario } from '../models/usuario';

async function validarToken(req: Request) {
    return new Promise(async (resolve, reject) => {
        try {
            const token = req.headers['authorization'];

            if (!token) {
                reject('Token não informado');
            }

            await jwt.verify((token as string), (process.env.SECRET as Secret), async (err, decoded) => {
                if (err) {
                    reject('Token inválido');
                }

                await Usuario.findOne({ 'login': (decoded as any).login })
                    .then(dados => {
                        if (!dados) {
                            reject('Login não encontrado');
                        } else {
                            resolve({
                                login: dados.login,
                                nome: dados.nome,
                                email: dados.email
                            });
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        } catch(err) {
            reject(err);
        }
    });
}

export { validarToken }

