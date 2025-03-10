import { Player } from "@minecraft/server";
import { createWarpButton, deleteWarp, getFavoriteWarpList, getWarpList, populateWarpList, replaceWarp, setQuickWarp, teleportToWarp, warpifyString } from "../../functions/WarpFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";
import { UI_EditDialog } from "./UI_editDialog";
import { Warp } from "../../classes/Warp";
import { fetchSetting } from "../../functions/SettingsFunctions";

/**
 * UI for selecting an edit action.
 * @param {Player} player
 * @param {Warp} warp
 */
export function UI_EditAction(player, warp) {
	try {
		const editAction = new ActionUI();
		editAction.setTitle("Choose Action");

		const editButton = editAction.addButton();
		editButton.setLabel("Edit Warp");
		editButton.onClick(() => {
			UI_EditDialog(player, warp);
		});

		let changeLocationButton = editAction.addButton();
		changeLocationButton.setLabel("Set to Current Position");
		changeLocationButton.onClick(() => {
			// If update location is clicked, open a confirmation menu.
			const confirmLocationUpdate = new ActionUI();
			confirmLocationUpdate.setTitle("Confirm Location Update");
			confirmLocationUpdate.setBody(`§eYou are about to change the location of ${warp.name}.`);

			const confirmButton = confirmLocationUpdate.addButton();
			confirmButton.setLabel("§l§2Confirm");
			confirmButton.onClick(() => {
				let editedWarp = new Warp(player.location, player.dimension.id, warp.name, warp.favorite, player.nameTag, warp.global);

				replaceWarp(player, warp, editedWarp);

				player.sendMessage(`§aUpdated location of ${warp.name}`);
			});

			const cancelButton = confirmLocationUpdate.addButton();
			cancelButton.setLabel("§l§cCancel");
			cancelButton.onClick(() => {
				// If canceled, return to the action screen.
				UI_EditAction(player, warp);
			});

			confirmLocationUpdate.show(player);
		});

		let quickWarp = warpifyString(player.getDynamicProperty(`player:quick_warp`));
		let showQuickWarpSet = quickWarp ? quickWarp.name === warp.name ? false : true : true


		if (fetchSetting(player, "quick_warp_mode") === "select" && showQuickWarpSet && !warp.global) {
			let setQuickWarpButton = editAction.addButton();
			setQuickWarpButton.setLabel("Set As Quick Warp");
			setQuickWarpButton.onClick(() => {
				setQuickWarp(player, warp);
			});
		}

		let deleteButton = editAction.addButton();
		deleteButton.setLabel("§cDelete");
		deleteButton.onClick(() => {
			// If delete is clicked, open a confirmation menu.
			const confirmDelete = new ActionUI();
			confirmDelete.setTitle("Confirm Delete");
			confirmDelete.setBody(`§4You are about to delete ${warp.name}.`);

			const confirmButton = confirmDelete.addButton();
			confirmButton.setLabel(`§l§cDelete`);
			confirmButton.onClick(() => {
				deleteWarp(player, warp);

				player.sendMessage(`§cDeleted ${warp.name}`);
			});

			const cancelButton = confirmDelete.addButton();
			cancelButton.setLabel("§l§2Go Back");
			cancelButton.onClick(() => {
				// If canceled, return to the action screen.
				UI_EditAction(player, warp);
			});

			confirmDelete.show(player);
		});

		editAction.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_EditAction to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
