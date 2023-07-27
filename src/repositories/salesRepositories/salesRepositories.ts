
import IfindBy from '../../types/findBy';
import IsaleBody from '../../types/saleBody';
const db = require('../../database');

class salesRepositories
{
  async create({userId,sale}:IsaleBody)
  {
    const {tipo, data, produto, valor, vendedor} = sale;
 
      const [row] = await db.query(`
      INSERT INTO sales(tipo,data,produto,valor,vendedor,user_id)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *
      `, [tipo, data, produto, valor, vendedor, userId]);
      
      return row;
  }

  async findAll()
  {
    const rows = await db.query("SELECT * FROM sales");
    return rows;
  }

  async deleteAll()
  {
    await db.query("DELETE FROM sales");
    
  }

  async findBy(query:IfindBy){

    const {
      id,
      limit=20,
      offset=0,
      order="asc",
      field="vendedor"
    } = query;

    const fields = ["tipo","data","produto","valor","vendedor"];

    const isValidField =fields.some((fieldItem)=> fieldItem.toUpperCase() === field.toUpperCase())

    if(!isValidField)
    {
      throw "field invalido, os fields validos são tipo,data,produto,valor,vendedor"
    }

    const direction = order.toUpperCase() ==='DESC'?"DESC":"ASC";

    const [count] = await db.query(`
     SELECT COUNT(*) FROM sales
     WHERE user_id = $1
   `,[id]);

    const rows = await db.query(`
     SELECT * FROM sales
     WHERE user_id = $1
     ORDER BY id ${direction}
     LIMIT $2
     OFFSET $3
     
    `,[id,limit,offset]);
    return {count:count.count,data:rows};
  }

  async aboutValues(id:string)
  {
 
    const [vendaProdutor] = await db.query(`
     SELECT SUM(valor) as valor , COUNT(tipo) FROM sales 
     WHERE (tipo = 1 AND user_id = $1)
    `,[id]);
   
    const [vendaAfiliado] = await db.query(`
     SELECT SUM(valor) as valor , COUNT(tipo) FROM sales 
     WHERE (tipo = 2 AND user_id = $1)
    `,[id]);
   
    const [comissãoPaga] = await db.query(`
     SELECT SUM(valor) as valor , COUNT(tipo) FROM sales 
     WHERE (tipo = 3 AND user_id = $1)
    `,[id]);
    
    const [comissãoRecebida]  = await db.query(`
     SELECT SUM(valor) as valor , COUNT(tipo) FROM sales 
     WHERE (tipo = 4 AND user_id = $1)
    `,[id]);

    return [
      {
        name:"venda produtor",
        ...vendaProdutor
      },
      {
        name:"venda afiliado",
        ...vendaAfiliado
      },
      {
        name:"comissão paga",
        ...comissãoPaga
      },
      {
        name:"comissão recebida",
        ...comissãoRecebida
      }
    ];
    
  }
   
}

export default new salesRepositories()