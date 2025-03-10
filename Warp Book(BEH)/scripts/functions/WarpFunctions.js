import { Player, world } from "@minecraft/server";
import { Warp } from "../classes/Warp";
import { setPlayerProperty } from "./PlayerFunctions";
import { toIdFormat, toTitleCase } from "./StringFunctions";
import { ActionUIButton } from "../ui_engine/ActionUIButton";
import { ActionUI } from "../ui_engine/ActionUI";
import { getFilteredPropertyIds } from "./DynamicPropertyFunction";

/**
 * Adds a warp to a player.
 * @param {Player} player The player to add the warp to.
 * @param {Warp} warp The warp to be added to the player.
 */
export function addWarp(player, warp, mode = "player") {
	const warpJSONString = stringifyWarp(warp);
	let warpId = toIdFormat(warp.name);

	if (mode === "player") {
		setPlayerProperty(player, `warp:${warpId}`, warpJSONString);
	} else if (mode === "world") {
		world.setDynamicProperty(`global_warp:${warpId}`, warpJSONString);
	}
}

/**
 * Deleted a warp from a player.
 * @param {Player} player The player to delete the warp from.
 * @param {Warp} warp The warp to be deleted from the player.
 */
export function deleteWarp(player, warp) {
	if (warp.global) {
		let warpId = toIdFormat(warp.name);

		// Delete the dynamic property by setting it to undefined.
		world.setDynamicProperty(`global_warp:${warpId}`, undefined);
		return;
	}

	// First, make sure the player has the warp to be replaced.
	if (!hasWarp(player, toIdFormat(warp.name))) {
		throw new Error(`Player does not have warp: ${warp.name}`);
	}

	let warpId = toIdFormat(warp.name);

	let quickWarp = warpifyString(player.getDynamicProperty(`player:quick_warp`));

	if (quickWarp && quickWarp.name === warp.name) {
		player.setDynamicProperty(`player:quick_warp`, undefined);
	}

	// Delete the dynamic property by setting it to undefined.
	setPlayerProperty(player, `warp:${warpId}`, undefined);
}

/**
 * Replaces an existing warp with a new one.
 * @param {Player} player
 * @param {Warp} warpToReplace
 * @param {Warp} newWarp
 */
export function replaceWarp(player, warpToReplace, newWarp) {
	try {
		if (warpToReplace.global) {
			deleteWarp(player, warpToReplace);
			if (newWarp.global) {
				addWarp(player, newWarp, "world");
			} else {
				addWarp(player, newWarp);
			}

			return;
		}

		// First, make sure the player has the warp to be replaced.
		if (!hasWarp(player, toIdFormat(warpToReplace.name))) {
			throw new Error("Cannot replace warp. Player does not have warp to be replaced.");
		}

		deleteWarp(player, warpToReplace);

		if (newWarp.global) {
			addWarp(player, newWarp, "world");
		} else {
			addWarp(player, newWarp);
		}
	} catch (error) {
		throw new Error(`Could not replace warp: ${error.message}${error.stack}`);
	}
}

/**
 * Converts a Warp to a JSON string.
 * @param {Warp} warp
 * @returns {string}
 */
export function stringifyWarp(warp) {
	try {
		return JSON.stringify(warp);
	} catch (error) {
		console.error(`Error converting Warp to JSON string: ${error.message}`);
	}
}

/**
 * Converts a JSON string to a Warp instance.
 * @param {string} string
 */
export function warpifyString(string) {
	try {
		// Parse the JSON string.
		let warpData = JSON.parse(string);

		// Validate the Warp JSON data.
		validateWarpData(warpData);

		// Create an instance of Warp from the JSON data.
		let warpInstance = new Warp(warpData.location, warpData.dimensionId, warpData.name, warpData.favorite, warpData.ownerName, warpData.global);

		// Return the instance.
		return warpInstance;
	} catch (error) {
		return undefined;
	}
}
/**
 * Validates a Warp JSON string.
 * @param {string} warpData A JSON string representing a Warp.
 */
export function validateWarpData(warpData) {
	if (!("location" in warpData)) {
		throw new Error("Missing Warp location.");
	}

	if (!("dimensionId" in warpData)) {
		throw new Error("Missing Warp dimension id.");
	}

	if (!("name" in warpData)) {
		throw new Error("Missing Warp name.");
	}

	if (!("favorite" in warpData)) {
		throw new Error("Missing Warp favorite value.");
	}
}

/**
 * Checks to see if the given player has a warp with the given id.
 * @param {Player} player
 * @param {string} warpId
 */
export function hasWarp(player, warpId) {
	try {
		// Get the list of Warps saved on the player.
		let warpList = getWarpList(player);

		// Check to see if no warps were returned.
		if (!warpList) {
			// Player has no warps, so they don't have the given one. Return false.
			return false;
		}

		// Attempt to find a Warp instance that the given id.
		let foundWarp = warpList.find((warp) => toIdFormat(warp.name) === warpId);

		// If such a warp was found, return true. Otherwise, return false.
		if (foundWarp) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw new Error(`Error searching for warp with id: '${warpId}' on player: ${player.nameTag}: ${error.message}`);
	}
}

/**
 * Gets the list of warps saved to a player.
 * @param {Player} player The player to retrieve warps from.
 * @param {boolean} includeFavorites Whether or not to retrieve favorited warps.
 * @returns {Array<Warp>|undefined}
 */
export function getWarpList(player, includeFavorites = true) {
	try {
		// Get filtered dynamic property IDs for player warps.
		let warpPropertyList = getFilteredPropertyIds(player, "warp:");

		// Ensure the filter found any properties.
		if (!warpPropertyList.length) {
			// If there were no warp properties, return undefined.
			return undefined;
		}

		// Convert warp properties to warp instances.
		return convertToWarpInstances(warpPropertyList, player, includeFavorites);
	} catch (error) {
		throw new Error(`Error retrieving Warp list for player: ${player.nameTag}: ${error.message}`);
	}
}

/**
 * Gets the list of global warps saved to the world.
 * @returns {Array<Warp>|undefined}
 */
export function getGlobalWarpList() {
	try {
		// Get filtered dynamic property IDs for global warps.
		let warpPropertyList = getFilteredPropertyIds(world, "global_warp:");

		// Ensure the filter found any properties.
		if (!warpPropertyList.length) {
			// If there were no warp properties, return undefined.
			return undefined;
		}

		// Convert warp properties to warp instances.
		return convertToWarpInstances(warpPropertyList, world, true);
	} catch (error) {
		throw new Error(`Error retrieving global Warp list: ${error.message}`);
	}
}

/**
 * Gets the list of warps saved to a player that are favorited.
 * @param {Player} player
 * @returns {Array<Warp>|undefined}
 */
export function getFavoriteWarpList(player) {
	try {
		// Get the complete list of warps on the player.
		let warpList = getWarpList(player);

		// Make sure the player has any warps. If not, return.
		if (!warpList) {
			return;
		}

		// Filter the list of warps to get only ones that are favorited.
		let favoriteWarpList = warpList.filter((warp) => warp.favorite == true);

		// Return the list if it has any elements, otherwise return undefined.
		return favoriteWarpList.length > 0 ? favoriteWarpList : undefined;
	} catch (error) {
		throw new Error(`Error retrieving favorite Warp list for player: ${player.nameTag}: ${error.message}`);
	}
}

/**
 * Converts a list of warp property IDs to Warp instances.
 * @param {Array<string>} warpPropertyList - The list of warp property IDs.
 * @param {world|Entity} source - The source to retrieve warp properties from.
 * @param {boolean} includeFavorites - Whether or not to include favorited warps.
 * @returns {Array<Warp>}
 */
export function convertToWarpInstances(warpPropertyList, source, includeFavorites) {
	let warpInstanceList = [];

	for (let warpId of warpPropertyList) {
		try {
			// Get the value of the Warp property. Data will be in the form of a JSON string.
			let currentWarpData = source.getDynamicProperty(warpId);

			// Parse the Warp data into a Warp object.
			let currentWarp = warpifyString(currentWarpData);

			// If includeFavorites is false and the warp is favorited, skip it.
			if (!includeFavorites && currentWarp.favorite) {
				continue;
			}

			// Insert the Warp into the list.
			warpInstanceList.push(currentWarp);
		} catch (error) {
			throw new Error(`Could not retrieve Warp with id: '${warpId}' from source: ${source.nameTag || "world"}: ${error.message}`);
		}
	}

	return warpInstanceList;
}

/**
 * Teleports a player to the given Warp.
 * @param {Player} player
 * @param {Warp} warp
 */
export function teleportToWarp(player, warp) {
	let warpLocation = warp.location;
	let warpDimensionId = warp.dimensionId;

	// Teleport the player.
	player.teleport(warpLocation, { dimension: world.getDimension(warpDimensionId) });

	// Log the players last used warp.
	setPlayerProperty(player, `player:last_warp`, stringifyWarp(warp));

	// Send a message to the player.
	player.sendMessage(`§aTeleported to ${warp.name}`);
}

export function setQuickWarp(player, warp) {
	// Convert the warp to a string.
	let warpString = stringifyWarp(warp);

	setPlayerProperty(player, `player:quick_warp`, warpString);
}

/**
 * Opens an edit dialog for a warp.
 * @param {Player} player
 * @param {Warp} warp
 */
export function openEditMenu(player, warp) {}

/**
 * @callback createWarpClickFunction
 * @param {Player} player - The player who initiated the interaction.
 * @param {Warp} warp - The Warp the player interacted with.
 */

/**
 *
 * @param {Warp} warp The warp used to create the button.
 * @param {ActionUIButton} button The button to add the warp data into.
 * @param {Player} player The player to be teleported when the button is clicked.
 * @param {createWarpClickFunction} clickFunc The function to be used as the onClick function for each button.
 */
export function createWarpButton(warp, button, player, clickFunc) {
	try {
		// Set the label for the button to the warps name.
		button.setLabel(`${warp.global ? "§l§2" : warp.favorite ? "§l§5" : "§l§8"}${warp.name}\n§r§8${toTitleCase(warp.dimensionId.split(":")[1])}: (${Math.floor(warp.location.x)},${Math.floor(warp.location.y)},${Math.floor(warp.location.z)})`);

		// Set the buttons onClick function to teleport the player.
		button.onClick(() => {
			clickFunc(player, warp);
		});
	} catch (error) {
		// In the event that a warp cannot be made into a button, display an error button in its stead.
		button.setLabel("§cClick to see error");

		// Allow the player to click the error button to see the error message.
		button.onClick(() => {
			player.sendMessage(`${error.message}`);
		});
	}
}

/**
 * Populates an actionUI's button list with warps.
 * @param {ActionUI} ui
 * @param {Player} player
 * @param {createWarpClickFunction} clickFunc The function to be used as the onClick function for each button.
 */
export function populateWarpList(ui, player, clickFunc, includeGlobal = false) {
	try {
		// Get a list of the warps saved to the player, excluding favorited warps.
		let warpList = getWarpList(player, false);

		// Get a list of favorited warps.
		let favoriteWarpList = getFavoriteWarpList(player);

		// Get a list of global warpr.s
		let globalWarpList = getGlobalWarpList();

		// Check for the case where the player has no warps.
		// Should never be possible, but check for it anyway.
		if (!warpList) {
			throw new Error(`Could not generate Warp list. Player ${player.nameTag} has no warps.`);
		}

		if (globalWarpList && includeGlobal) {
			for (let globalWarp of globalWarpList) {
				createWarpButton(globalWarp, ui.addButton(), player, clickFunc);
			}
		}

		// Iterate through the list of favorite warps, if there are any.
		if (favoriteWarpList) {
			for (let favoriteWarp of favoriteWarpList) {
				createWarpButton(favoriteWarp, ui.addButton(), player, clickFunc);
			}
		}

		// Iterate through the list of unfavorited warps and create a button for each one.
		for (let warp of warpList) {
			createWarpButton(warp, ui.addButton(), player, clickFunc);
		}
	} catch (error) {
		throw new Error(`Error populating warp list for player ${player.nameTag}: ${error.message}`);
	}
}
