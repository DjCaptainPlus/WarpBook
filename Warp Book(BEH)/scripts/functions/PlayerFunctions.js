import { Player } from "@minecraft/server";

/**
 * Sets a dynamic property on a player.
 * @param {Player} player - The player entity to set the property on.
 * @param {string} propertyId - The unique identifier of the property to set.
 * @param {string|number|boolean|undefined} value - The value to assign to the property. Can be a string, number, boolean, or undefined.
 */
export function setPlayerProperty(player, propertyId, value) {
	try {
		player.setDynamicProperty(propertyId, value);
	} catch (error) {
		console.error(`Error setting property ${propertyId} on ${player.nameTag}: ${error.message}`);
	}
}

/**
 * Gets a dynamic property from a player.
 * @param {Player} player - The player entity to get the property from.
 * @param {string} propertyId - The unique identifier of the property to retrieve.
 * @returns {string|number|boolean|undefined} - The value of the property, or undefined if it does not exist.
 */
export function getPlayerProperty(player, propertyId) {
	try {
		return player.getDynamicProperty(propertyId);
	} catch (error) {
		console.error(`Error getting property ${propertyId} from ${player.nameTag}: ${error.message}`);
		return undefined;
	}
}

/**
 * Teleports one player to another.
 * @param {Player} player1
 * @param {Player} player2
 */
export function teleportPlayerToPlayer(player1, player2) {
	player1.teleport(player2.location, { dimension: player2.dimension });
}
