import { expect, test, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

// test('O usuário consegue criar uma nova transação', () => {
//   // fazer a chamada HTTP p/ criar uma nova transação

//   const responseStatusCode = 500

//   expect(responseStatusCode).toEqual(201)
// })

describe('Transactions routes', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest') //executando todas as migrations antes de todos os testes

    await app.ready() /* usando esse trecho para que todos os plugins
    sejam carregados antes que os testes executem */
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('user can create a new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      });

    expect(response.statusCode).toEqual(201)
  })

  //UM TESTE NUNCA PODE DEPENDER DO OUTRO, TODOS TEM QUE SER INDEPENDENTES
  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit'
    });

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie',cookies)
      .expect(200)

      expect(listTransactionsResponse.body.transactions).toEqual([
        expect.objectContaining({
          title: 'New transaction',
          amount: 5000
        })
      ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      });

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie',cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie',cookies)
      .expect(200)

      expect(getTransactionResponse.body.transaction).toEqual(
        expect.objectContaining({
          title: 'New transaction',
          amount: 5000
        }))
  })


  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'Credit transaction',
      amount: 5000,
      type: 'credit'
    });

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    await request(app.server)
      .post('/transactions')
      .set('Cookie',cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit'
      });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie',cookies)
      .expect(200)

      expect(summaryResponse.body.summary).toEqual({
        amount: 3000
      })
  })
})

