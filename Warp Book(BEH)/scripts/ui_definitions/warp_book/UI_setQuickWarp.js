import { Player } from "@minecraft/server";
import { populateWarpList, setQuickWarp } from "../../functions/WarpFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";

/**
 * UI for selecting a quick warp.
 * @param {Player} player
 */
export function UI_SetQuickWarp(player) {
	try {
		const selectQuickWarp = new ActionUI();
		selectQuickWarp.setTitle("Select Quick Warp");

		// Populate the UI with buttons for each warp.
		populateWarpList(selectQuickWarp, player, setQuickWarp, true);

		selectQuickWarp.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_Warp to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
