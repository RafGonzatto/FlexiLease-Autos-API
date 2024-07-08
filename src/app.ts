import express from 'express';
import cors from 'cors';
import AppDataSource from './database/connection';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import './container';
import fs from 'fs';
import path from 'path';
import router from './routes/routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const setupSwagger = () => {
  const routerDir = path.join(__dirname, 'routes');
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'API FlexiLease Autos',
        version: '1.0.0',
        description: 'Documentação da API do Projeto FlexiLease Autos',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: fs.readdirSync(routerDir).map((file) => path.join(routerDir, file)),
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    },
    customSiteTitle: 'FlexiLease Autos API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
};

const startServer = async () => {
  try {
    await AppDataSource.connect();
    console.log('Conectado ao MongoDB com sucesso via DataSource');
    setupSwagger();
    app.use('/', router);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB via DataSource:', error);
  }
};

export { app, startServer };
