import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary() //universal unique id
    table.text('title').notNullable()
    table.decimal('amount',10,2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    /*
      knex.fn.now para pegar a data corrente quando essa migration for utilizada,
      em diferentes bancos, já que cada banco possui uma função diferente para
      obter a data corrente.
    */

  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}

