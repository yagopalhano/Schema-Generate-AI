const parser = require('swagger-parser');
const Joi = require('joi');

// Carregue o documento OpenAPI (Swagger)
const openApiDocument = './swagger.json';

parser.validate(openApiDocument, (err, api) => {
  if (err) {
    console.error('Erro ao analisar o documento OpenAPI:', err);
  } else {
    // Crie validações Joi para cada endpoint
    const endpointValidations = {};
    
    for (const path in api.paths) {
      //for (const method in api.paths[path]) {
      for (const method in api.paths[path]) {  
        
        const endpoint = api.paths[path][method];
        // // Crie um objeto Joi para validar os parâmetros da solicitação
        const requestValidation = {};

        // Adicione validações para os parâmetros de consulta (query parameters)
        if (endpoint.parameters) {
          endpoint.parameters.forEach((param) => {
            if (param.in === 'query') {
              requestValidation[param.name] = Joi.string();
              if (param.schema.type === 'integer') {
                requestValidation[param.name] = Joi.number().integer();
              }
              if (param.schema.nullable) {
                requestValidation[param.name] = requestValidation[param.name].allow(null);
              }
            }
          });
        }

        //Crie um objeto Joi para validar o corpo da solicitação
        if (endpoint.requestBody) {
          const content = endpoint.requestBody.content;
          for (const mimeType in content) {
            requestValidation[mimeType] = Joi.object().keys(content[mimeType].schema);
          }
        }

        // Crie um objeto Joi para validar os parâmetros do caminho (path parameters)
        if (path.includes('{')) {
          const pathParameters = path.match(/\{(.+?)\}/g).map((param) => param.replace(/\{|\}/g, ''));
          pathParameters.forEach((param) => {
            requestValidation[param] = Joi.string();
            if (endpoint.parameters) {
              const pathParam = endpoint.parameters.find((p) => p.in === 'path' && p.name === param);
              if (pathParam && pathParam.schema.nullable) {
                requestValidation[param] = requestValidation[param].allow(null);
              }
            }
          });
        }

        endpointValidations[`${method} ${path}`] = {
          request: requestValidation
        };
      }
    }

    // Exiba as validações dos endpoints
    // console.log(endpointValidations);

    //Crie um objeto Joi para validar as respostas
    const responseValidation = {};
    for (const schema in api.components.schemas) {
      console.log(schema);
    }
    // const schemas = api.components.schemas
    // const myJson = JSON.stringify(schemas);
    // console.log(myJson)
  }
});
