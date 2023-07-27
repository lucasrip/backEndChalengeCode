import { Response, Request, query } from 'express';
import salesRepositories from '../../repositories/salesRepositories/salesRepositories';
import { Isale } from '../../types/sale';
import removeFiles from '../../utils/removeFiles';
import fileFields from './fileFilds';
import * as yup from 'yup';

class salesController
{
   
  async store(req:Request,res:Response)
  {
    const body =req.body;
    const receivedFile =req.file;
    
    if(!receivedFile)
    {
      res.status(500).json("é necessario enviar um arquivo .txt valido");
      removeFiles();

      return;
    }
  
    const file:string = require(receivedFile?.path);

    const saleSepareted = file.replace(/([0-9]{5}[-]{1}[0-9]{2})/g,"<separete>$1")
    .replace("<separete>","")
    .replace(/[\n]|[\r]/g,"")
    .split("<separete>")    
   
   const sales = saleSepareted.map((sale)=>{
    const saleObj:Isale ={
      tipo:"",
      data:"",
      produto:"",
      valor:"",
      vendedor:"",
    }
      fileFields.forEach( saleConfig =>{
      
          const indexStartValue = saleConfig.start;
          const indexEndValue = saleConfig.end;
          saleObj[saleConfig.name as keyof Isale] = sale.slice(indexStartValue,indexEndValue);
        })

     return saleObj;
     })
    
     removeFiles();

     try {
      sales?.map(async(sale)=>{
        
        const  saleBody = {
          userId: body?.id,
          sale
        }
       return await salesRepositories.create(saleBody);
      })

      res.status(201).json("vendas salvas com sucesso");
    } catch (error) {
      res.status(501).json(error);
    }     

  }

  async findBy(req:Request,res:Response)
  {
 
    const query ={
      id:req.query.id as string,
      limit:req.query.limit as string,
      offset:req.query.offset as string,
      order:req.query.limit as string,
      field:req.query.field as string
    }
    let errors: never[] = [];
 
    const schema = yup.object().shape({
      id: yup.string(),
      limit: yup.number(),
      start: yup.number(),
      order: yup.string(),
      field: yup.string(),
    });
     
    await schema.validate(query)
      .catch((err)=> {
        errors =err.errors;
      });
 
    if(errors.length ) {
      res.status(500).json(errors[0]);
      return;
    }

    try {
      
    const sales = await salesRepositories.findBy(query);
     res.status(201).json(sales);
    } catch (error) {
    res.status(500).json(error);
      
    }
  }

  async showAll(req:Request,res:Response)
  {
    try {
      const sales = await salesRepositories.findAll();
      res.status(201).json(sales);
    } catch (error) {
      res.status(500).json(error);
      
    }
  }
  async aboutValues(req:Request,res:Response)
  {
    const id = req.query.id as string;

    try {
      const selasAboutValues = await salesRepositories.aboutValues(id);
      res.status(201).json(selasAboutValues);
    } catch (error) {
      res.status(500).json(error);
      
    }
  }

  async deleteAll(req:Request,res:Response)
  {
    try {
      await salesRepositories.deleteAll();
      res.status(201).json("tabela limpa");
    } catch (error) {
      res.status(501).json(error);
      
    }
  }
}

export default new salesController()