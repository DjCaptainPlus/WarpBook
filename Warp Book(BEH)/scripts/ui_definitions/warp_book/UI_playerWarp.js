import { Player, world } from "@minecraft/server";
import { ActionUI } from "../../ui_engine/ActionUI";
import { TeleportRequest } from "../../classes/TeleportRequest";
import { acceptTeleportRequest, getPlayerByName, getTeleportRequests } from "../../functions/TeleportRequestFunctions";
import { fetchSetting } from "../../functions/SettingsFunctions";
import { teleportPlayerToPlayer } from "../../functions/PlayerFunctions";

/**
 * UI for selecting a player to request to teleport to.
 * @param {Player} player
 */
export function UI_PlayerWarp(player) {
	try {
		const playerWarp = new ActionUI();
		playerWarp.setTitle("Select Player");

		// Get a list of all players on the world.

		// Whether or not to exclude the player who opened the UI from the list. (Used for testing)
		let excludeSelf = true;

		let playerList = world.getPlayers({ excludeNames: [excludeSelf ? player.nameTag : ""] });

		// Iterate through the list of players and create a button for each one.
		for (let playerInstance of playerList) {
			let playerButton = playerWarp.addButton();
			playerButton.setLabel(playerInstance.nameTag);
			playerButton.onClick(() => {
				if (fetchSetting(playerInstance, "auto_accept_tp_requests") === true) {
					teleportPlayerToPlayer(player, getPlayerByName(playerInstance.nameTag));
					return;
				}

				let teleportRequest = new TeleportRequest(player.nameTag, playerInstance.nameTag);

				teleportRequest.send();
			});
		}

		playerWarp.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_PlayerWarp to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
