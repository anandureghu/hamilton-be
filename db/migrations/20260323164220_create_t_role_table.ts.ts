import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('m_role', (table) => {
    table.bigIncrements('id').primary();
    table.string('name').unique().notNullable();
    table.string('description');
    table.bigInteger('created_by').nullable();
    table.bigInteger('updated_by').nullable();
    table
      .specificType('created_at', 'TIMESTAMPTZ')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .specificType('updated_at', 'TIMESTAMPTZ')
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex('m_role').insert([
    {
      name: 'admin',
      description: 'Full system access',
      created_by: 0,
      updated_by: 0,
    },
    {
      name: 'staff',
      description: 'Limited administrative access',
      created_by: 0,
      updated_by: 0,
    },
    {
      name: 'user',
      description: 'Standard mobile app user',
      created_by: 0,
      updated_by: 0,
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('m_role');
}
