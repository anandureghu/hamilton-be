export const searchUserByMobNoQuery = `SELECT 
    tu.id, 
    tu.username, 
    tu.firstname, 
    tu.lastname, 
    tu.email, 
    tu.gender, 
    tu.address, 
    tu.image_url, 
    tu.role_id, 
    tu.is_active, 
    tu.created_at, 
    tu.updated_at,
    COALESCE(
      json_agg(
        json_build_object(
          'id', tuv.id, 
          'registration_no', tuv.license_plate, 
          'name', mv."name"
        )
      ) FILTER (WHERE tuv.id IS NOT NULL), '[]'
    ) AS vehicles
FROM t_user tu  
LEFT JOIN t_user_vehicle tuv ON tu.id = tuv.t_user_id 
LEFT JOIN m_vehicle mv ON tuv.m_vehicle_id = mv.id 
WHERE (tu.mobile_no = $1 OR tu.whatsapp_no = $1) 
AND tu.is_active = true
GROUP BY tu.id;
`;
