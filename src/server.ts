import express  from 'express';
import cors from './middlewares/cors';
import routes from './routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(routes);
app.use(cors);
app.listen(port,()=> console.log(`api rodando na porta ${port}`));