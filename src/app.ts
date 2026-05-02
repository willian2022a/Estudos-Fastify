import fastify from 'fastify';
import { knex } from './database';
import crypto  from 'node:crypto'
import { env } from './env';
import { transactionsRoutes } from './routes/transactions';
import cookie from '@fastify/cookie'

export const app = fastify()

// app.get('/hello', async () => {
//   // const transaction = await knex('transactions').insert({
//   //   id: crypto.randomUUID(),
//   //   title: 'Transação de teste',
//   //   amount: 1000
//   // }).returning('*')

//   const transaction = await knex('transactions').where('amount',0)
//   return transaction
// })

app.register(cookie)

/* ESTE HANDLER É GLOBAL PARA TODOS OS ARQUIVOS DO PROJETO */
app.addHook('preHandler', async (request, reply) => {

})

app.register(transactionsRoutes, {
  prefix: 'transactions'
})
