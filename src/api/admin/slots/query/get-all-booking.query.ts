export const getAllBookingQuery = `select 
tsb.id,
booking_date,
json_build_object('slot_id',ms.id, 'slot_timing', ms.slot_timing ) as slot_id,
tsb.description,
json_build_object('id',tu.id, 'firstname', tu.firstname ,'lastname', tu.lastname) as user,
json_build_object('id', tuv.id , 'license_plate',tuv.license_plate , 'odo_reading',tuv.odo_reading,
'nickname',tuv."name" , 'name', mv."name") as vehicle,
json_build_object('id', mst.id, 'name',mst."name" ) as service,
status,
tsb.created_by,
tsb.updated_by,
tsb.created_at,
tsb.updated_at,
tsb.is_active
 from t_slot_booking tsb
left join m_slots ms on tsb.slot_id = ms.id 
left join t_user tu on tsb.user_id = tu.id
left join t_user_vehicle tuv on tsb.vehicle_id = tuv.id 
left join m_vehicle mv on tuv.m_vehicle_id = mv.id 
left join m_service_type mst on tsb.service_type_id = mst.id 
where tsb.status != 'cancelled' 
and tsb.is_active = true and tsb.booking_date = $1;`;
