/**
 * Utility for handling optional Select fields in shadcn-ui.
 * 
 * CRITICAL: SelectItem cannot have an empty string value prop.
 * This constraint is enforced by shadcn at runtime and will throw an error.
 * 
 * Solution: Use a non-empty sentinel value (NONE_SENTINEL) in the Select component
 * that maps to empty string ('') in form state when the user clears the selection.
 * 
 * Usage:
 * 1. Always use mapStateToSelect() when passing state to Select value prop
 * 2. Always use mapSelectToState() in onValueChange handler
 * 3. Include <SelectItem value={NONE_SENTINEL}>None</SelectItem> as first option
 */

export const NONE_SENTINEL = '__none__';

/**
 * Maps a Select value to form state value.
 * Converts the NONE_SENTINEL to empty string, passes through other values.
 * 
 * @param value - The value from the Select component
 * @returns Empty string if sentinel, otherwise the original value
 */
export function mapSelectToState(value: string): string {
  return value === NONE_SENTINEL ? '' : value;
}

/**
 * Maps form state value to Select value.
 * Converts empty string to NONE_SENTINEL, passes through other values.
 * This ensures the Select component never receives an empty string value.
 * 
 * @param value - The form state value (may be empty string)
 * @returns NONE_SENTINEL if empty, otherwise the original value
 */
export function mapStateToSelect(value: string | undefined | null): string {
  return !value || value === '' ? NONE_SENTINEL : value;
}
