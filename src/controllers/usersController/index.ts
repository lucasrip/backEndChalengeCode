import { Response, Request } from 'express';
import * as yup from 'yup';
import usersRepositories from '../../repositories/usersRepositories/usersRepositories';
import Iuser from '../../types/user';

class userController
{
  
  async store(req:Request,res:Response)
  {
    const body =req.body;
    
    let errors: never[] = [];
 
    const schema = yup.object().shape({
      nome: yup.string().min(5,'o nome precisa ter pelo menos 5 caracteres').required('o name precisa ser preenchido'),
      email: yup.string().email().required('o email precisa ser preenchido'),
      senha: yup.string().min(6,'a senha precisa ter pelo menos 6 caracteres').required('a senha precisa ser preenchida')
    });
     
    await schema.validate(body)
      .catch((err)=> {
        errors =err.errors;
      });
 
 
    if(errors.length ) {
      res.status(500).json(errors[0]);
      return;
    }
   
    try {
      const user = await usersRepositories.create(body);
      res.status(201).json(user);
    } catch (error) {
      res.status(501).json("email ja cadastrado");
    }
 
  }

  async showAll(req:Request,res:Response)
  {
    try {
      const users = await usersRepositories.findAll();
      res.status(201).json(users);
    } catch (error) {
      res.status(501).json(error);
      
    }
  }
  async deleteAll(req:Request,res:Response)
  {
   try {
    await usersRepositories.deleteAll();
    res.status(201).json("tabela limpa");
   } catch (error) {
    res.status(501).json(error);
    
   }
  }

  async findUser(req:Request,res:Response)
  {
    const body =req.body;
  
    try {
      const user = await usersRepositories.findByUser(body);
      res.status(201).json(user);
    } catch (error) {
      res.status(501).json("usuario não encontrado");
    }

  }

  async recoverUser(req:Request,res:Response)
  {
    const {nome,email,senhaAtual} =req.body;

    try {
      const currentUserConfig:Iuser = {
        nome,
        email,
        senha:senhaAtual
      }
        await usersRepositories.findByUser(currentUserConfig);
      } 
      catch (error) {
        res.status(501).json("usuario não encontrado, com os valores dos campos nome e mail e senha enviados");
        return;
      }
      
      try {
    
        const upedtedUser = await usersRepositories.recoverUser(req.body);
        res.status(201).json(upedtedUser);
        return;
      } catch (error) {
        res.status(501).json("houve algum erro no server favor tentar novamente mais tarde");
        return;
      }

  }


}

export default new userController();