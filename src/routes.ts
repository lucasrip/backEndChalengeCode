import express from 'express';
import salesController from './controllers/salesController';
import usersController from './controllers/usersController';
import uploadFile from './middlewares/uploadFile';

const routes = express.Router();

routes.get('/users', usersController.showAll);
routes.post('/users', usersController.store);
routes.delete('/users', usersController.deleteAll);
routes.put('/recoverUser', usersController.recoverUser);

routes.post('/findUser', usersController.findUser);

routes.post('/sales',uploadFile,salesController.store);
routes.get('/sales', salesController.showAll);
routes.delete('/sales', salesController.deleteAll);

routes.get('/sales/findBy', salesController.findBy);
routes.get('/sales/aboutValues', salesController.aboutValues);

//documentar no swagger


export default routes;