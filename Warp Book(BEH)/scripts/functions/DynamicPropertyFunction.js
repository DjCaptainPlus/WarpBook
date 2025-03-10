import { Entity, World, world } from "@minecraft/server";

/**
 * Filters a list of dynamic properties and returns a list of those that begin with the given prefix.
 * @param {Array<string>} propertyIdList
 * @param {string} namespace
 * @returns {Array<string>}
 */
export function filterProperties(propertyIdList, namespace) {
	return propertyIdList.filter((propertyId) => propertyId.startsWith(namespace));
}

/**
 * Gets a filtered list of dynamic property IDs with the specified namespace for either a world or an entity.
 * @param {World|Entity} source - The source object (e.g., world or entity).
 * @param {string} namespace
 * @returns {Array<string>}
 */
export function getFilteredPropertyIds(source, namespace) {
	return source.getDynamicPropertyIds().filter((propertyId) => propertyId.startsWith(namespace));
}

/**
 * @callback propertyFunctionCallback
 * @param {string} id
 * @param {number|string|boolean|undefined} value
 */

/**
 * Runs a function on each property in the list, for either a world or an entity.
 * @param {Object} source - The source object (e.g., world or entity).
 * @param {string} namespace
 * @param {propertyFunctionCallback} func
 * @returns {number} - The number of properties the function was run on.
 */
export function executeOnPropertyList(source, namespace, func) {
	let propertyIdList = getFilteredPropertyIds(source, namespace);
	propertyIdList.forEach((propertyId) => {
		const value = source.getDynamicProperty(propertyId);
		func(propertyId, value);
	});
	return propertyIdList.length;
}
