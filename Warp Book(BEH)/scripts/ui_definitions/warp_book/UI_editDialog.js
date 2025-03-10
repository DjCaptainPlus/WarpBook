import { Player } from "@minecraft/server";
import { createWarpButton, getFavoriteWarpList, getWarpList, populateWarpList, replaceWarp, teleportToWarp } from "../../functions/WarpFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";
import { ModalUI } from "../../ui_engine/ModalUI";
import { Warp } from "../../classes/Warp";

/**
 * UI for editing a warp.
 * @param {Player} player
 * @param {Warp} warp
 */
export function UI_EditDialog(player, warp) {
	try {
		// Save the current data of the warp.
		const warpName = warp.name;
		const warpLocation = warp.location;
		const warpDimensionId = warp.dimensionId;
		const warpFavorite = warp.favorite;
		const warpGlobal = warp.global;

		// The new data.
		let newWarpName = warpName;
		let newWarpFavorite = warpFavorite;
		let newWarpGlobal = warpGlobal;

		// Create UI
		const editDialog = new ModalUI();
		editDialog.setTitle(`Edit: ${warp.name}`);
		editDialog.setSubmitLabel("Save Changes");

		const warpNameEditor = editDialog.addTextfield();
		warpNameEditor.setLabel("Warp Name");
		warpNameEditor.setPlaceholderText("");
		warpNameEditor.setDefaultValue(warpName);
		warpNameEditor.onUpdate((oldValue, newValue) => {
			newWarpName = newValue;
		});

		const favoriteToggleEditor = editDialog.addToggle();
		favoriteToggleEditor.setLabel("Favorite");
		favoriteToggleEditor.setDefaultValue(warpFavorite);
		favoriteToggleEditor.onUpdate((oldValue, newValue) => {
			newWarpFavorite = newValue;
		});

		const globalToggleEditor = editDialog.addToggle();
		globalToggleEditor.setLabel("Global");
		globalToggleEditor.setDefaultValue(warpGlobal);
		globalToggleEditor.onUpdate((oldValue, newValue) => {
			newWarpGlobal = newValue;
		});

		editDialog.onSubmit(() => {
			if (newWarpName !== warpName || newWarpFavorite !== warpFavorite || newWarpGlobal !== warpGlobal) {
				let editedWarp = new Warp(warpLocation, warpDimensionId, newWarpName, newWarpFavorite, player.nameTag, newWarpGlobal);
				replaceWarp(player, warp, editedWarp);
			}
		});

		editDialog.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_EditDialog to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
