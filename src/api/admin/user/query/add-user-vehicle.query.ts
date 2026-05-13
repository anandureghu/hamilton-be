export const addUserVehicleQuery = `INSERT INTO t_user_vehicle (
    license_plate,  
    odo_reading, 
    m_vehicle_id, 
    t_user_id, 
    created_by, 
    updated_by
) VALUES ($1, $2, $3, $4, $5, $5) RETURNING id;`;
