import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from "../middleware/check-session-id-exists";

export function transactionsRoutes(app: FastifyInstance){

  /* ESTE HANDLER É GLOBAL PARA TODAS AS ROTAS DESSE ARQUIVO, NÃO SERÁ
  EXECUTADO PELAS ROTAS DE OUTRO ARQUIVO */
  app.addHook('preHandler', async (request, reply) => {

  })

  app.get('/',{
    preHandler: [checkSessionIdExists]
  }, async (request,reply) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()

    return { transactions }
  })

  app.get('/:id', {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.uuid(), //zod já entende internament que uuid é do tipo string
    })

    const { sessionId } = request.cookies
    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({
        id:id,
        session_id: sessionId
      })
      //.andWhere('session_id',sessionId)
      .first()
    return { transaction }
  })

  app.get('/summary', {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const { sessionId } = request.cookies
    const summary = await knex('transactions')
      .where('session_id',sessionId)
      .sum('amount', { as: 'amount' })
      .first()
    return { summary }
  })


  app.post('/', async (request, reply) => { //reply é o mesmo que response apenas uma outra forma de nomear o retorno da api
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit','debit'])
    })

    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    let { sessionId } = request.cookies

    if(!sessionId){
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        //expires: new Date('2026-01-05T08:00:00') //alternativa muito específica pouco utilizada
        maxAge: 60*60*24*7 //7 dias
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount*-1,
      session_id: sessionId
    })

    return reply.status(201).send()
  })


}