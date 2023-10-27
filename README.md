## Gerando schemas com IA
Criar validações de schemas apartir de um arquivo JSON utilizando o chat da OpenAI.

## Requisitos
* NPM >= 8.11.0
* Node >= 16.16.0
* OPENAI_API_KEY*
  * Para gerar a sua secret key, crie uma conta na [OpenAI](https://platform.openai.com/signup) e siga a instrução deste [link](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)
 
## Instruções para execução
Para executar você precisar criar um arquivo `.env` na raiz do projeto e incluir uma variável com o nome `OPENAI_API_KEY` recebendo a sua secret key gerada no passo anterior.
Após isto, basta executar os comandos abaixo e utilizar os schemas gerados.

```javascript
npm i
node main.js
```

## Observações
Para rodar o projeto será necessário ter saldo na OpenAI.
Quando criamos uma conta recebemos um saldo de $5.00 para realizar testes na ferramenta.
