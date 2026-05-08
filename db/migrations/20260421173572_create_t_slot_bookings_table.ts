import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('t_slot_booking', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.date('booking_date');
    table
      .uuid('slot_id')
      .references('id')
      .inTable('m_slots')
      .onDelete('SET NULL');
    table.string('description');
    table
      .uuid('user_id')
      .references('id')
      .inTable('t_user')
      .onDelete('SET NULL');
    table
      .uuid('vehicle_id')
      .references('id')
      .inTable('t_user_vehicle')
      .onDelete('SET NULL');
    table
      .uuid('service_type_id')
      .references('id')
      .inTable('m_service_type')
      .onDelete('SET NULL');
    table
      .enum('status', ['confirmed', 'cancelled'], {
        useNative: true,
        enumName: 'booking_status',
      })
      .defaultTo('confirmed');
    table.boolean('is_active').defaultTo(true);
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
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('t_slot_booking');
}
