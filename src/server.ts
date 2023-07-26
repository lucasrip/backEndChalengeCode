import express  from 'express';
import cors from './middlewares/cors';
import routes from './routes';

import swaggerUI from 'swagger-ui-express';
import swaggerDocumento from '../swagger.json';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors);
app.use(routes);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocumento));

app.listen(port,()=> console.log(`api rodando na porta ${port}`));