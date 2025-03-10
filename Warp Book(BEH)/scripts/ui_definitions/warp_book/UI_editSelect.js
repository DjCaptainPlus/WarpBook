import { Player } from "@minecraft/server";
import { createWarpButton, getFavoriteWarpList, getGlobalWarpList, getWarpList, populateWarpList, teleportToWarp } from "../../functions/WarpFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";
import { UI_EditDialog } from "./UI_editDialog";
import { UI_EditAction } from "./UI_editAction";
import { toTitleCase } from "../../functions/StringFunctions";

/**
 * UI for selecting a warp to edit.
 * @param {Player} player
 */
export function UI_EditSelect(player) {
	try {
		const edit = new ActionUI();
		edit.setTitle("Select Warp To Edit");

		let globalWarpsList = getGlobalWarpList();

		let ownedGlobalWarps = undefined;

		if (globalWarpsList) {
			ownedGlobalWarps = globalWarpsList.filter((globalWarp) => {
				return globalWarp.ownerName === player.nameTag || player.isOp();
			});
		}
		
		

		if (ownedGlobalWarps) {
			ownedGlobalWarps.forEach((warp) => {
				let currentButton = edit.addButton();
				currentButton.setLabel(`§l§2${warp.name}\n§r§8${toTitleCase(warp.dimensionId.split(":")[1])}: (${Math.floor(warp.location.x)},${Math.floor(warp.location.y)},${Math.floor(warp.location.z)})`);
				currentButton.onClick(() => {
					UI_EditAction(player, warp);
				});
			});
		}

		if (getWarpList(player,true)) {
			// Populate the UI with buttons for each warp.
			populateWarpList(edit, player, UI_EditAction);
		}

		edit.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_EditSelect to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
