/**
 * Registration password rules: length + uppercase + lowercase + digit.
 * @returns {string | null} Error message, or null if valid.
 */
export function passwordPolicyError(password) {
  const p = String(password ?? '')
  if (p.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (!/[A-Z]/.test(p)) {
    return 'Password must include at least one uppercase letter.'
  }
  if (!/[a-z]/.test(p)) {
    return 'Password must include at least one lowercase letter.'
  }
  if (!/[0-9]/.test(p)) {
    return 'Password must include at least one number.'
  }
  return null
}
