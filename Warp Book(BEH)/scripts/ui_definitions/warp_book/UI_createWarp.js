import { Player, world } from "@minecraft/server";
import { ModalUI } from "../../ui_engine/ModalUI";
import { Text } from "../../Text";
import { Warp } from "../../classes/Warp";
import { addWarp, hasWarp } from "../../functions/WarpFunctions";
import { toIdFormat, toTitleCase } from "../../functions/StringFunctions";

/**
 * UI for warp creation screen.
 * @param {Player} player
 */
export function UI_CreateWarp(player) {
	let newWarpName = undefined;
	let newWarpFavorite = false;
	let newWarpGlobal = false;

	const UI = new ModalUI();
	UI.setTitle("Create Warp");
	UI.setSubmitLabel("Create");

	const warpName = UI.addTextfield();
	warpName.setLabel("Warp Name");
	warpName.setPlaceholderText("");
	warpName.setDefaultValue("");
	warpName.onUpdate((oldValue, newValue) => {
		newWarpName = newValue;
	});

	const favoriteToggle = UI.addToggle();
	favoriteToggle.setLabel("Favorite");
	favoriteToggle.setDefaultValue(false);
	favoriteToggle.onUpdate((oldValue, newValue) => {
		newWarpFavorite = newValue;
	});

	const globalToggle = UI.addToggle();
	globalToggle.setLabel("Global");
	globalToggle.setDefaultValue(false);
	globalToggle.onUpdate((oldValue, newValue) => {
		newWarpGlobal = newValue;
	});

	UI.show(player);

	// On form submit
	UI.onSubmit(() => {
		// Check to make sure the player typed in a Warp name.
		if (newWarpName) {
			// Make sure the player doesn't already have a Warp with the given name.
			if (hasWarp(player, toIdFormat(newWarpName))) {
				player.sendMessage(`§cYou already have a warp named ${toTitleCase(newWarpName)}`);
				return;
			}
			try {
				// Create an instance of Warp based on the data from the player and the form.
				let newWarp = new Warp(player.location, player.dimension.id, newWarpName, newWarpFavorite, player.nameTag, newWarpGlobal);

				if (newWarpGlobal === false) {
					// Add the Warp to the player.
					addWarp(player, newWarp);

					// Send a message to the player confirming the warp was created.
					player.sendMessage(`§aCreated Warp: ${newWarp.name}.`);
				} else {
					// Add the warp to the world.
					addWarp(player, newWarp, "world");
					world.sendMessage(`§a${player.nameTag} Created Global Warp: ${newWarp.name}.`);
				}
			} catch (error) {
				player.sendMessage(`${Text.error.couldNotCreateWarp}: ${error.message}`);
			}
		} else {
			player.sendMessage(Text.error.noWarpName);
		}
	});
}
