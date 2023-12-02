import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "FLAD API",
            version: "1.0.0",
            description:
                "This is the Express API for the Flad project.",
            contact: {
                name: "Flad Dev",
                url: "code",
                email: "fladdevpro@gmail.com",
            },
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            }
          }
        },
        security: [{
          bearerAuth: ["read"]
        }]
    },
    apis: ["./dist/**/*.js"],
};


export const specs = swaggerJsdoc(options);