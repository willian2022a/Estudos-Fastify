import { config } from 'dotenv';
import z from 'zod';

/*
  TODO: após instalar o pacote dotenv com "npm i dotenv", posso importar com
  o comando [import 'dotenv/config'] e agora esse arquivo database.ts tem acesso as variáveis de
  ambiente cadastradas no arquivo .env que está na raíz do projeto, através
  do acesso à variáve global "process", acessando com: process.env.['NOMED DA VARIAVEL DE AMBIENTE']
*/

console.log('>>>>>>>>>>>>>>>>>>>>',process.env.NODE_ENV)

/*
  o NODE_ENV não precisou ser colocado com o valor de 'test' nos arquivos
  .env pois ao executar o vitest ele já preenche essa variável de ambiente
  com o valor de 'test'
*/
if(process.env.NODE_ENV === 'test'){
  config({ path: '.env.test' })
}else{
  config() //ao não passar configurações o dotenv vai procurar as configuraçòes no arquivo .env
}

const envSquema = z.object({
  NODE_ENV: z.enum(['development','test','production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite','pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333)
})

const _env = envSquema.safeParse(process.env)

if(_env.success === false){
  console.error('Invalid enviroment variables! ', z.treeifyError(_env.error))

  throw new Error('Invalid enviroment variables')
}

export const env = _env.data

