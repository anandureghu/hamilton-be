export const updateBookingSlotQuery = `UPDATE t_slot_booking SET
    booking_date = COALESCE($1, booking_date),
    slot_id = COALESCE($2, slot_id),
    description = COALESCE($3, description),
    vehicle_id = COALESCE($4, vehicle_id),
    service_type_id = COALESCE($5, service_type_id),
    status = COALESCE($6, status),
    updated_by = $7,
    updated_at = NOW()
WHERE id = $8 AND user_id = $9
RETURNING id;`;
