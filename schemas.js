import Joi from "joi";

export default function schemas() {
    const sentAtSchema = Joi.string().isoDate().description('Date and time when the message was sent.');

    const lightMeasuredPayloadSchema = Joi.object({
        lumens: Joi.number().integer().min(0).required().description('Light intensity measured in lumens.'),
        sentAt: sentAtSchema.required(),
    }).required();

    const turnOnOffPayloadSchema = Joi.object({
        command: Joi.string().valid('on', 'off').required().description('Whether to turn on or off the light.'),
        sentAt: sentAtSchema.required(),
    }).required();

    const dimLightPayloadSchema = Joi.object({
        percentage: Joi.number().integer().min(0).max(100).required().description('Percentage to which the light should be dimmed to.'),
        sentAt: sentAtSchema.required(),
    }).required();

    const streetlightIdSchema = Joi.string().description('The ID of the streetlight.');

    const commonHeadersSchema = Joi.object({
        'my-app-header': Joi.number().integer().min(0).max(100).required(),
    }).required();

    const kafkaOperationTraitsSchema = Joi.object({
        bindings: Joi.object({
            kafka: Joi.object({
                clientId: Joi.string().valid('my-app-id').required(),
            }).required(),
        }).required(),
    }).required();

    const lightMeasuredMessageSchema = Joi.object({
        name: 'lightMeasured',
        title: 'Light measured',
        summary: 'Inform about environmental lighting conditions of a particular streetlight.',
        contentType: 'application/json',
        traits: commonHeadersSchema,
        payload: lightMeasuredPayloadSchema,
    }).required();

    const turnOnOffMessageSchema = Joi.object({
        name: 'turnOnOff',
        title: 'Turn on/off',
        summary: 'Command a particular streetlight to turn the lights on or off.',
        traits: commonHeadersSchema,
        payload: turnOnOffPayloadSchema,
    }).required();

    const dimLightMessageSchema = Joi.object({
        name: 'dimLight',
        title: 'Dim light',
        summary: 'Command a particular streetlight to dim the lights.',
        traits: commonHeadersSchema,
        payload: dimLightPayloadSchema,
    }).required();

    const saslScramSecuritySchema = Joi.object({
        type: 'scramSha256',
        description: 'Provide your username and password for SASL/SCRAM authentication',
    }).required();

    const certsSecuritySchema = Joi.object({
        type: 'X509',
        description: 'Download the certificate files from service provider',
    }).required();

    const streetlightIdParameterSchema = Joi.object({
        description: 'The ID of the streetlight.',
        schema: streetlightIdSchema.required(),
    }).required();

    const infoSchema = Joi.object({
        title: Joi.string().required(),
        version: Joi.string().required(),
        description: Joi.string().required(),
        license: Joi.object({
            name: Joi.string().required(),
            url: Joi.string().uri().required(),
        }).required(),
    }).required();

    const serverSchema = Joi.object({
        url: Joi.string().required(),
        protocol: Joi.string().required(),
        description: Joi.string().required(),
        security: Joi.array().items(Joi.object({
            saslScram: Joi.array(),
            certs: Joi.array(),
        })).required(),
        tags: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        })).required(),
    }).required();

    const asyncApiSchema = Joi.object({
        asyncapi: '2.6.0',
        info: infoSchema,
        servers: Joi.object({
            'scram-connections': serverSchema,
            'mtls-connections': serverSchema,
        }).required(),
        defaultContentType: 'application/json',
        channels: Joi.object({
            'smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured': Joi.object({
                description: Joi.string().required(),
                parameters: Joi.object({
                    streetlightId: streetlightIdParameterSchema,
                }).required(),
                publish: Joi.object({
                    summary: Joi.string().required(),
                    operationId: Joi.string().required(),
                    traits: Joi.array().items(kafkaOperationTraitsSchema),
                    message: Joi.object({
                        $ref: Joi.string().required(),
                    }).required(),
                }).required(),
            }).required(),
            'smartylighting.streetlights.1.0.action.{streetlightId}.turn.on': Joi.object({
                parameters: Joi.object({
                    streetlightId: streetlightIdParameterSchema,
                }).required(),
                subscribe: Joi.object({
                    operationId: Joi.string().required(),
                    traits: Joi.array().items(kafkaOperationTraitsSchema),
                    message: Joi.object({
                        $ref: Joi.string().required(),
                    }).required(),
                }).required(),
            }).required(),
            'smartylighting.streetlights.1.0.action.{streetlightId}.turn.off': Joi.object({
                parameters: Joi.object({
                    streetlightId: streetlightIdParameterSchema,
                }).required(),
                subscribe: Joi.object({
                    operationId: Joi.string().required(),
                    traits: Joi.array().items(kafkaOperationTraitsSchema),
                    message: Joi.object({
                        $ref: Joi.string().required(),
                    }).required(),
                }).required(),
            }).required(),
            'smartylighting.streetlights.1.0.action.{streetlightId}.dim': Joi.object({
                parameters: Joi.object({
                    streetlightId: streetlightIdParameterSchema,
                }).required(),
                subscribe: Joi.object({
                    operationId: Joi.string().required(),
                    traits: Joi.array().items(kafkaOperationTraitsSchema),
                    message: Joi.object({
                        $ref: Joi.string().required(),
                    }).required(),
                }).required(),
            }).required(),
        }).required(),
        components: Joi.object({
            messages: Joi.object({
                lightMeasured: lightMeasuredMessageSchema,
                turnOnOff: turnOnOffMessageSchema,
                dimLight: dimLightMessageSchema,
            }).required(),
            schemas: Joi.object({
                lightMeasuredPayload: lightMeasuredPayloadSchema,
                turnOnOffPayload: turnOnOffPayloadSchema,
                dimLightPayload: dimLightPayloadSchema,
                sentAt: sentAtSchema,
            }).required(),
            securitySchemes: Joi.object({
                saslScram: saslScramSecuritySchema,
                certs: certsSecuritySchema,
            }).required(),
            parameters: Joi.object({
                streetlightId: streetlightIdParameterSchema,
            }).required(),
            messageTraits: Joi.object({
                commonHeaders: commonHeadersSchema,
            }).required(),
            operationTraits: Joi.object({
                kafka: kafkaOperationTraitsSchema,
            }).required(),
        }).required(),
    }).required();
}