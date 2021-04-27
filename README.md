# nodejs
Projeto com NodeJs + Typescript + Mongo

## Chamadas CURL para testar rapidamente a API

```shell
curl -i -X POST -H 'Content-Type: application/json' -d '{"login": "marcelo", "senha": "123456", "email": "marcelo.vismari@hotmail.com", "nome": "Marcelo" }' http://localhost:3000/api/usuarios

curl -i -X POST -H 'Content-Type: application/json' -d '{"login": "marcelo", "senha": "123456" }' http://localhost:3000/api/usuarios/login
```

## Links

* [Documentação Mongoose](https://mongoosejs.com/docs/api.html#model_Model.find)