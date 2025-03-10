import { Player } from "@minecraft/server";
import { createWarpButton, getFavoriteWarpList, getWarpList, populateWarpList, teleportToWarp } from "../../functions/WarpFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";

/**
 * UI for selecting a warp to teleport to.
 * @param {Player} player
 */
export function UI_Warp(player) {
	try {
		const warpUI = new ActionUI();
		warpUI.setTitle("Select Warp");

		// Populate the UI with buttons for each warp.
		populateWarpList(warpUI, player,teleportToWarp);

		warpUI.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_Warp to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
