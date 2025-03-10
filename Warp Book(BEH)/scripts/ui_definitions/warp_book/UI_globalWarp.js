import { Player } from "@minecraft/server";
import { createWarpButton, getFavoriteWarpList, getGlobalWarpList, getWarpList, populateWarpList, teleportToWarp } from "../../functions/WarpFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";
import { toTitleCase } from "../../functions/StringFunctions";

/**
 * UI for selecting a warp to teleport to.
 * @param {Player} player
 */
export function UI_GlobalWarp(player) {
	try {
		const globalWarp = new ActionUI();
		globalWarp.setTitle("Select Global Warp");

		let globalWarpsList = getGlobalWarpList();

		globalWarpsList.forEach((warp) => {
			let currentButton = globalWarp.addButton();
			currentButton.setLabel(`§l§2${warp.name}\n§r§8${toTitleCase(warp.dimensionId.split(":")[1])}: (${Math.floor(warp.location.x)},${Math.floor(warp.location.y)},${Math.floor(warp.location.z)})`);
			currentButton.onClick(() => {
				teleportToWarp(player,warp);
			})
		})

		globalWarp.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_GlobalWarp to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
