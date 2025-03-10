import { ActionUI } from "../../ui_engine/ActionUI";
import { UI_CreateWarp } from "./UI_createWarp";
import { getGlobalWarpList, getWarpList, teleportToWarp, warpifyString } from "../../functions/WarpFunctions";
import { UI_Warp } from "./UI_warp";
import { UI_EditSelect } from "./UI_editSelect";
import { UI_PlayerWarp } from "./UI_playerWarp";
import { acceptAllTeleportRequests, acceptTeleportRequest, declineAllTeleportRequests, deleteTeleportRequest, getIncomingTPRequests, getOutgoingTPRequest, getPlayerByName, isPlayerOnline } from "../../functions/TeleportRequestFunctions";
import { UI_ManageIncoming } from "./UI_manageIncoming";
import { UI_ManageOutgoing } from "./UI_manageOutgoing";
import { Player, world } from "@minecraft/server";
import { UI_Settings } from "./UI_settings";
import { fetchSetting } from "../../functions/SettingsFunctions";
import { getPlayerProperty } from "../../functions/PlayerFunctions";
import { toTitleCase } from "../../functions/StringFunctions";
import { UI_SetQuickWarp } from "./UI_setQuickWarp";
import { UI_GlobalWarp } from "./UI_globalWarp";

/**
 * UI for the main menu of the warp book.
 * @param {Player} player
 */
export function UI_Root(player) {
	try {
		const root = new ActionUI();
		root.setTitle("Warp Book");

		let warpList = getWarpList(player);
		let globalWarpList = getGlobalWarpList();
		let ownedGlobalWarps = undefined;
		if (globalWarpList) {
			ownedGlobalWarps = globalWarpList.filter((globalWarp) => {
				return globalWarp.ownerName === player.nameTag || player.isOp();
			});
		}
		let incomingRequests = getIncomingTPRequests(player);
		let outgoingRequest = getOutgoingTPRequest(player);
		let quickWarpMode = fetchSetting(player, "quick_warp_mode");

		// Quick warp button
		if (quickWarpMode !== "disabled" && warpList) {
			if (quickWarpMode === "last_warp" && !getPlayerProperty(player, "player:last_warp")) {
				return;
			}

			const quickWarpButton = root.addButton();
			quickWarpButton.setIconFile("quick_warp.png");

			switch (quickWarpMode) {
				case "last_warp": {
					// Get the last warp the player used.
					let warpString = getPlayerProperty(player, `player:last_warp`);
					let warp = warpifyString(warpString);

					quickWarpButton.setLabel(`§l§1${warp.name}\n§r§8${toTitleCase(warp.dimensionId.split(":")[1])}: (${Math.floor(warp.location.x)},${Math.floor(warp.location.y)},${Math.floor(warp.location.z)})`);
					quickWarpButton.onClick(() => {
						teleportToWarp(player, warp);
					});
					break;
				}
				case "select": {
					if (!getPlayerProperty(player, `player:quick_warp`)) {
						quickWarpButton.setLabel(`Select Quick Warp`);
						quickWarpButton.onClick(() => {
							UI_SetQuickWarp(player);
						});
					} else {
						// Get the player's quick warp.
						let warpString = getPlayerProperty(player, `player:quick_warp`);
						let warp = warpifyString(warpString);

						quickWarpButton.setLabel(`§l§1${warp.name}\n§r§8${toTitleCase(warp.dimensionId.split(":")[1])}: (${Math.floor(warp.location.x)},${Math.floor(warp.location.y)},${Math.floor(warp.location.z)})`);

						quickWarpButton.onClick(() => {
							teleportToWarp(player, warp);
						});
					}

					break;
				}
			}
		}
		// Accept and decline quick buttons
		if (incomingRequests) {
			const acceptAllButton = root.addButton();
			acceptAllButton.setLabel("Accept Teleport Requests.");
			acceptAllButton.setIconFile("accept.png");
			acceptAllButton.onClick(() => {
				acceptAllTeleportRequests(incomingRequests, player);
			});

			const declineAllButton = root.addButton();
			declineAllButton.setLabel("Decline Teleport Requests.");
			declineAllButton.setIconFile("decline.png");
			declineAllButton.onClick(() => {
				declineAllTeleportRequests(incomingRequests, player);
			});
		}

		// Warp button
		if (warpList) {
			const warpButton = root.addButton();
			warpButton.setLabel("Warp");
			warpButton.setIconFile("warp.png");
			warpButton.onClick(() => {
				UI_Warp(player);
			});
		}

		// Player warp button
		if (world.getAllPlayers().length > 1) {
			const playerWarpButton = root.addButton();
			playerWarpButton.setLabel("Warp To Player");
			playerWarpButton.setIconFile("warp_player.png");
			playerWarpButton.onClick(() => {
				UI_PlayerWarp(player);
			});
		}

		// Global warps button
		if (globalWarpList) {
			const globalWarpButton = root.addButton();
			globalWarpButton.setLabel("Global Warps");
			globalWarpButton.setIconFile("global_warp.png");
			globalWarpButton.onClick(() => {
				UI_GlobalWarp(player);
			});
		}

		// Create warp button
		const createWarpButton = root.addButton();
		createWarpButton.setLabel("Create Warp");
		createWarpButton.setIconFile("add_warp.png");
		createWarpButton.onClick(() => {
			UI_CreateWarp(player);
		});

		// Edit warp button
		if (warpList || ownedGlobalWarps) {
			const editWarpButton = root.addButton();
			editWarpButton.setLabel("Edit Warp");
			editWarpButton.setIconFile("edit_warp.png");
			editWarpButton.onClick(() => {
				UI_EditSelect(player);
			});
		}

		// Settings button
		const settingsButton = root.addButton();
		settingsButton.setLabel("Settings");
		settingsButton.setIconFile("settings.png");
		settingsButton.onClick(() => {
			UI_Settings(player);
		});

		// Incoming requests button
		if (incomingRequests) {
			const manageIncoming = root.addButton();
			manageIncoming.setLabel("Manage Incoming");
			manageIncoming.onClick(() => {
				UI_ManageIncoming(player);
			});
		}

		// Outgoing request button
		if (outgoingRequest) {
			const manageOutgoing = root.addButton();
			manageOutgoing.setLabel("Manage Outgoing");
			manageOutgoing.onClick(() => {
				UI_ManageOutgoing(player);
			});
		}

		// Show the UI to the player.
		root.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_Root to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
