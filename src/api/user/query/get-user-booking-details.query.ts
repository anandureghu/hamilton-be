export const getUserBookingDetailsQuery = `select 
	tsb.id,
  tsb.booking_date::date::text as booking_date, 
	json_build_object('id', ms.id,'slot_timing', ms.slot_timing ) as slot,
	tsb.description ,
	tsb.status,
	json_build_object('id',mst.id, 'service_name', mst."name" ),
	json_build_object(
    'id',tuv.id, 
    'license_plate', tuv.license_plate , 
    'odo_reading', tuv.odo_reading )
  as vehicle_detail
from t_slot_booking tsb 
left join m_slots ms on 
  tsb.slot_id = ms.id and ms.is_active = true
left join m_service_type mst on 
  tsb.service_type_id = mst.id and mst.is_active =true
left join t_user_vehicle tuv on tsb.vehicle_id = tuv.id 
where 
  tsb.user_id =$1 
  AND tsb.is_active = true 
  AND tsb.booking_date>current_date;`;
