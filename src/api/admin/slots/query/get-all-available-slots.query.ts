export const getAllAvailableSlotsQuery = `WITH slot_data AS (
    SELECT
        id,
        slot_timing 
    FROM m_slots WHERE is_active = true),
booked_slots AS (
    SELECT 
        ms.slot_timing, 
        tsb.service_type_id, 
        COUNT(tsb.id) AS service_count 
    FROM t_slot_booking tsb
    LEFT JOIN m_slots ms ON tsb.slot_id = ms.id 
    WHERE tsb.booking_date  = $1 and tsb.status != 'cancelled' GROUP BY ms.slot_timing, tsb.service_type_id),
service_grid AS (
    SELECT 
        sd.id AS slot_id, 
        sd.slot_timing, 
        mst.id AS service_id, 
        mst.name, 
        mst.capacity
    FROM slot_data sd
    CROSS JOIN m_service_type mst)
SELECT 
    sg.slot_timing,
    sg.slot_id,
    json_agg(
        json_build_object(
            'service_name', sg.name,
            'service_id',sg.service_id ,
            'total_capacity', sg.capacity,
            'available_slot', CASE 
                WHEN msso.id IS NOT NULL THEN 0 
                ELSE sg.capacity - COALESCE(bs.service_count, 0) 
            END
        )
    ) AS service_availability
FROM service_grid sg
LEFT JOIN booked_slots bs ON sg.slot_timing = bs.slot_timing AND sg.service_id  = bs.service_type_id 
left join m_service_type mst on bs.service_type_id = mst.id 
LEFT JOIN m_service_slot_overrides msso ON msso.override_date = $1 AND  
(msso.slot_time = sg.slot_timing or msso.slot_time is null)
where 
coalesce( (select count(id) from t_slot_booking where booking_date = $1),0) <5 
GROUP BY sg.slot_id, sg.slot_timing 
ORDER BY sg.slot_timing;`;
