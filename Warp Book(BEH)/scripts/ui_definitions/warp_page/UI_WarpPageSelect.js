import { ItemStack, Player } from "@minecraft/server";
import { ActionUI } from "../../ui_engine/ActionUI";
import { populateWarpList, stringifyWarp } from "../../functions/WarpFunctions";
import { setHeldItem } from "../../InventoryLibrary";
import { Warp } from "../../classes/Warp";

/**
 *
 * @param {Player} player
 */
export function UI_WarpPageSelect(player) {
	const warpPageSelect = new ActionUI();
	warpPageSelect.setTitle("Bind Warp or Action");

	let acceptButton = warpPageSelect.addButton();
	acceptButton.setLabel("§2Accept");
	acceptButton.onClick(() => {
		bindActionToPage(player, "accept");
	});

	let declineButton = warpPageSelect.addButton();
	declineButton.setLabel("§cDecline");
	declineButton.onClick(() => {
		bindActionToPage(player, "decline");
	});

	populateWarpList(warpPageSelect, player, bindWarpToPage, true);

	warpPageSelect.show(player);
}

/**
 *
 * @param {Player} player
 * @param {string} action
 */
function bindActionToPage(player, action) {
	let boundPage;
	if (action === "accept") {
		// Create a new itemstack.
		boundPage = new ItemStack("realm:warp_page_accept", 1);
	} else {
		// Create a new itemstack.
		boundPage = new ItemStack("realm:warp_page_decline", 1);
	}
	player.playSound("block.enchanting_table.use");
	setHeldItem(player, boundPage);
}

/**
 * @param {ItemStack} itemStack
 * @param {Warp} warp
 */
function bindWarpToPage(player, warp) {
	// Create a new itemstack.
	let boundPage = new ItemStack("realm:warp_page_bound", 1);
	boundPage.setDynamicProperty(`page:warp`, stringifyWarp(warp));
	boundPage.nameTag = `§r§e${warp.name}`;

	player.playSound("block.enchanting_table.use");
	setHeldItem(player, boundPage);
}
