import IrecoverUser from "../../types/recoverUser";
import Iuser from "../../types/user";

const db = require('../../database');

class usersRepositories
{
  async create({nome,email,senha}:Iuser)
  {
    const [row] = await db.query(`
    INSERT INTO users(nome,email,senha)
    VALUES($1,$2,$3)
    RETURNING *
    `,[nome,email,senha]);
  
    return row;
  }

  async findAll()
  {
    const rows = await db.query("SELECT * FROM users");
    return rows;
  }

  async deleteAll()
  {
    await db.query("DELETE FROM users");
 
  }

  async findByUser({nome,email,senha}:Iuser)
  {
    const [row] = await db.query(`
     SELECT * FROM users 
     WHERE nome = $1 AND email = $2 AND senha = $3
    `,[nome,email,senha]);

    if(row.length === 0)
    {
      throw "usuario não encontrado";
    }
    
    return row;
  }

  async recoverUser({nome,email,senhaAtual,novaSenha}:IrecoverUser)
  {
    const [row] = await db.query(`
     UPDATE users 
     SET senha = $3
     WHERE nome = $1 AND email = $2
     RETURNING *
    `,[nome,email,novaSenha]);
    
    return row
  }
  
}

export default new usersRepositories();