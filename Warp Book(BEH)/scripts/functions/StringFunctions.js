/**
 * Converts a string to Title Case (first letter of each word capitalized).
 * @param {string} str - The input string to convert.
 * @returns {string} - The string converted to Title Case.
 */
export function toTitleCase(str) {
	return str
		.toLowerCase() // Convert the entire string to lowercase first
		.split(" ") // Split string into an array of words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
		.join(" "); // Join the words back into a single string
}

/**
 * Converts a string into an ID format (all lowercase with underscores replacing spaces).
 * @param {string} str - The input string to convert.
 * @returns {string} - The string converted to ID format.
 */
export function toIdFormat(str) {
	return str
		.toLowerCase() // Convert the entire string to lowercase
		.replace(/\s+/g, "_"); // Replace all spaces (or multiple spaces) with underscores
}
