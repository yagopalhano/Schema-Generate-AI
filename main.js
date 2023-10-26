import parser from 'swagger-parser';
import  Joi from 'joi';
import OpenAI from 'openai';
import 'dotenv/config'
import { sleep } from 'openai/core';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Carregue o documento OpenAPI (Swagger)
const openApiDocument = './swagger.json';


parser.validate(openApiDocument, (err, api) => {
  if (err) {
    console.error('Erro ao analisar o documento OpenAPI:', err);
  } else {
    // Crie validações Joi para cada endpoint
    const endpointValidations = {};
    
    // for (const path in api.paths) {

    //   //for (const method in api.paths[path]) {
    //   for (const method in api.paths[path]) {  
        
    //     const endpoint = api.paths[path][method];
    //     // // Crie um objeto Joi para validar os parâmetros da solicitação
    //     const requestValidation = {};

    //     // Adicione validações para os parâmetros de consulta (query parameters)
    //     if (endpoint.parameters) {
    //       endpoint.parameters.forEach((param) => {
    //         if (param.in === 'query') {
    //           requestValidation[param.name] = Joi.string();
    //           if (param.schema.type === 'integer') {
    //             requestValidation[param.name] = Joi.number().integer();
    //           }
    //           if (param.schema.nullable) {
    //             requestValidation[param.name] = requestValidation[param.name].allow(null);
    //           }
    //         }
    //       });
    //     }

    //     //Crie um objeto Joi para validar o corpo da solicitação
    //     if (endpoint.requestBody) {
    //       const content = endpoint.requestBody.content;
    //       for (const mimeType in content) {
    //         requestValidation[mimeType] = Joi.object().keys(content[mimeType].schema);
    //       }
    //     }

    //     // Crie um objeto Joi para validar os parâmetros do caminho (path parameters)
    //     if (path.includes('{')) {
    //       const pathParameters = path.match(/\{(.+?)\}/g).map((param) => param.replace(/\{|\}/g, ''));
    //       pathParameters.forEach((param) => {
    //         requestValidation[param] = Joi.string();
    //         if (endpoint.parameters) {
    //           const pathParam = endpoint.parameters.find((p) => p.in === 'path' && p.name === param);
    //           if (pathParam && pathParam.schema.nullable) {
    //             requestValidation[param] = requestValidation[param].allow(null);
    //           }
    //         }
    //       });
    //     }

    //     endpointValidations[`${method} ${path}`] = {
    //       request: requestValidation
    //     };
    //   }
    // }

    // Exiba as validações dos endpoints
    // console.log(endpointValidations);

    //Crie um objeto Joi para validar as respostas
    
    let schemasToValidate = {};
    const propertiesObject = api.components.schemas;
    for (const schemaName in propertiesObject) {
      if (propertiesObject[schemaName].properties) {
        const propertie = propertiesObject[schemaName].properties;
        console.log(`Properties para o esquema "${schemaName}":`);
        console.log(JSON.stringify(propertie));
        
        const message = `
          based on the JSON below, return only the code, without explanations,
          with a const with the name schema with the validations using the JoiJS library,
          also validate the character limits and the mandatory nature of the fields.
          ${JSON.stringify(propertie)}
        `;

        const completion = openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{"role": "user", "content": message}]
      });

      console.log(completion);
      }
    }
  
    // const schemas = api.components.schemas
    // const myJson = JSON.stringify(schemas);
    // console.log(myJson)
  }
});
