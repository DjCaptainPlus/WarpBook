import { Player, world } from "@minecraft/server";
import { Settings } from "../Settings";

/**
 * Changes the value of a setting for a player.
 * @param {Player} player
 * @param {string} settingId
 * @param {number|string|boolean} newValue
 */
export function updateSetting(player, settingId, newValue) {
	player.setDynamicProperty(`setting:${settingId}`, newValue);
}

/**
 * Fetches the current value of a setting for a player.
 * @param {Player} player
 * @param {string} settingId
 * @returns {number|string|boolean|undefined}
 */
export function fetchSetting(player, settingId) {
	return player.getDynamicProperty(`setting:${settingId}`);
}

/**
 * Checks to see if a setting has been initialized on this player.
 * @param {Player} player
 * @param {string} settingId
 */
export function hasSetting(player, settingId) {
	// Get a list of dynamic properties on the player.
	let propertyList = player.getDynamicPropertyIds();

	// Filter the list to get ones that start with 'setting:'
	let settingsList = propertyList.filter((propertyId) => propertyId.startsWith(`setting:`));

	// Search for the setting.
	let foundSetting = settingsList.find((listSettingID) => listSettingID.endsWith(settingId));

	// If the setting was found, return true. Otherwise return false.
	if (foundSetting) {
		return true;
	} else {
		return false;
	}
}

/**
 * Initializes settings for a player.
 * @param {Player} player
 */
export function initializeSettings(player) {
	// Get the list of setting id's.
	const settingKeys = Object.keys(Settings);

	// Iterate through the settings, initialize settings that are not already.
	for (const settingKey of settingKeys) {
		// Get the setting object.
		const currentSetting = Settings[settingKey];

		const settingId = currentSetting.id;
		const defaultValue = currentSetting.default;

		// Check if the player already has this setting initialized. If they do, skip it.
		if (!hasSetting(player, settingId)) {
			updateSetting(player, `${settingId}`, defaultValue);
			//world.sendMessage(`Initialized setting '${settingId}' for ${player.nameTag} as ${defaultValue}`);
		}
	}
}
