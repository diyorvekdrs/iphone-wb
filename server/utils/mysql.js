/** mysql2 may return `insertId` as BigInt — JWT/JSON cannot handle BigInt. */
export function insertId(result) {
  const id = Number(result.insertId)
  return Number.isFinite(id) && id >= 1 ? id : null
}
