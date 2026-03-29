import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('t_user', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username').unique().notNullable();
    table.string('firstname').notNullable();
    table.string('lastname');
    table.string('email').unique().notNullable();
    table.string('google_id').unique();
    table.string('mobile_no', 20);
    table.string('whatsapp_no', 20);
    table
      .string('image_url')
      .defaultTo('https://api.dicebear.com/7.x/avataaars/svg?seed=Hamilton');
    table.enum('gender', ['male', 'female', 'others'], {
      useNative: true,
      enumName: 'gender_type',
    });
    table.date('dob');

    table
      .integer('role_id')
      .unsigned()
      .references('id')
      .inTable('m_role')
      .onDelete('SET NULL');
    table.text('note');
    table
      .uuid('created_by')
      .references('id')
      .inTable('t_user')
      .onDelete('SET NULL');
    table
      .uuid('updated_by')
      .references('id')
      .inTable('t_user')
      .onDelete('SET NULL');
    table
      .specificType('created_at', 'TIMESTAMPTZ')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .specificType('updated_at', 'TIMESTAMPTZ')
      .notNullable()
      .defaultTo(knex.fn.now());
    table.boolean('is_active').defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('t_user');
  await knex.raw('DROP TYPE public.gender_type;');
}
