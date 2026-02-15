/**
 * Utility for handling optional Select fields in shadcn-ui.
 * 
 * SelectItem cannot have an empty string value, so we use a sentinel
 * that gets mapped to empty string in component state to clear the selection.
 */

export const NONE_SENTINEL = '__none__';

/**
 * Maps a Select value to form state value.
 * Converts the NONE_SENTINEL to empty string, passes through other values.
 */
export function mapSelectToState(value: string): string {
  return value === NONE_SENTINEL ? '' : value;
}

/**
 * Maps form state value to Select value.
 * Converts empty string to NONE_SENTINEL, passes through other values.
 */
export function mapStateToSelect(value: string): string {
  return value === '' ? NONE_SENTINEL : value;
}
