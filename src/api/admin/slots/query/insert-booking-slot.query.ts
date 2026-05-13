export const insertBookingSlotQuery = `INSERT INTO t_slot_booking (
    booking_date,
    slot_id,
    description,
    user_id,
    vehicle_id,
    service_type_id,
    created_by,
    updated_by
)
SELECT 
    $1, 
    $2, 
    $3, 
    $4, 
    $5, 
    UNNEST($6::uuid[]), 
    $7, 
    $8  
RETURNING id;`;
