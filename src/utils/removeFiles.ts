import fs from 'node:fs';
import path from 'node:path';

export default async function removeFiles(folder ='./src/uploads')
{
  const files = fs.readdirSync(path.resolve(folder));
  files.forEach(file => {
    fs.unlinkSync(path.resolve(folder+'/'+file));
  });

}