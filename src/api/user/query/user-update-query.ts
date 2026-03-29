import { UpdateUserDto } from '../dto/update-user.dto';

export interface UpdateQueryResponse {
  query: string;
  values: unknown[];
}

export const userUpdateQuery = (
  id: string,
  updateData: UpdateUserDto,
): UpdateQueryResponse => {
  const entries = Object.entries(updateData as Record<string, unknown>).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );

  if (entries.length === 0) {
    throw new Error('No valid fields provided for update');
  }

  const setClause = entries
    .map(([key], index) => `${key} = $${index + 1}`)
    .join(', ');

  const values: unknown[] = entries.map(([, value]) => value);

  const query = `
    UPDATE t_user 
    SET ${setClause}, updated_at = NOW(), updated_by = $${entries.length + 1} 
    WHERE id = $${entries.length + 1} AND is_active = true
    RETURNING *;
  `;

  values.push(id);

  return { query, values };
};
