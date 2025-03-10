import { ItemStack, Player, system, world } from "@minecraft/server";
import { WarpBook } from "./items/warpBook";
import { deleteTeleportRequest, getIncomingTPRequests, getOutgoingTPRequest, getPlayerByName } from "./functions/TeleportRequestFunctions";
import { initializeSettings } from "./functions/SettingsFunctions";
import { executeOnPropertyList, getFilteredPropertyIds } from "./functions/DynamicPropertyFunction";
import { addWarp, warpifyString } from "./functions/WarpFunctions";
import { WarpPageUnbound } from "./items/warpPageUnbound";
import { WarpPageBound } from "./items/warpPageBound";
import { WarpPageAccept } from "./items/warpPageAccept";
import { WarpPageDecline } from "./items/warpPageDecline";
import { getEntityContainer, giveEntityItems } from "./InventoryLibrary";

world.beforeEvents.worldInitialize.subscribe((eventData) => {
	eventData.itemComponentRegistry.registerCustomComponent("realm:warp_book_use", WarpBook);
	eventData.itemComponentRegistry.registerCustomComponent("realm:warp_page_unbound", WarpPageUnbound);
	eventData.itemComponentRegistry.registerCustomComponent("realm:warp_page_bound", WarpPageBound);
	eventData.itemComponentRegistry.registerCustomComponent("realm:warp_page_accept", WarpPageAccept);
	eventData.itemComponentRegistry.registerCustomComponent("realm:warp_page_decline", WarpPageDecline);
});

world.afterEvents.playerSpawn.subscribe((eventData) => {
	const player = eventData.player;

	// When a player spawns(they either joined the world, or respawned), initialize any settings that haven't been already.
	initializeSettings(player);
});

world.beforeEvents.playerLeave.subscribe((eventData) => {
	let player = eventData.player;

	// When a player leaves, delete any teleport requests they were involved with.

	const outgoingRequest = getOutgoingTPRequest(player);
	const incomingRequests = getIncomingTPRequests(player);

	if (outgoingRequest) {
		deleteTeleportRequest(outgoingRequest);
	}

	if (incomingRequests) {
		incomingRequests.forEach((request) => deleteTeleportRequest(request));
	}
});

system.afterEvents.scriptEventReceive.subscribe((eventData) => {
	let eventId = eventData.id;
	let message = eventData.message;
	let player = eventData.sourceEntity;

	switch (eventId) {
		case "clear:warps": {
			let deletedWarpCount = executeOnPropertyList(player, "warp:", (id, value) => {
				player.setDynamicProperty(id, undefined);
			});

			player.sendMessage(`[System] §cDeleted ${deletedWarpCount} warps from ${player.nameTag}.`);

			break;
		}
		case "clear:global_warps": {
			let deletedGlobalWarpCount = executeOnPropertyList(world, "global_warp:", (id, value) => {
				world.setDynamicProperty(id, undefined);
			});

			player.sendMessage(`[System] §cDeleted ${deletedGlobalWarpCount} global warps.`);

			break;
		}
		case "clear:tp_requests": {
			let deletedTPCount = executeOnPropertyList(world, "tp_request:", (id, value) => {
				world.setDynamicProperty(id, undefined);
			});

			player.sendMessage(`[System] §cDeleted ${deletedTPCount} teleport requests.`);
			break;
		}
		case "list:settings": {
			executeOnPropertyList(player, "setting:", (id, value) => {
				player.sendMessage(`§9${id}: §a${value}`);
			});
			break;
		}
		case "clear:settings": {
			let settingCount = executeOnPropertyList(player, "setting:", (id, value) => {
				player.setDynamicProperty(id, undefined);
			});

			initializeSettings(player);
			player.sendMessage(`[System] §cReset ${settingCount} settings.`);
			break;
		}
		case "list:all": {
			executeOnPropertyList(player, "", (id, value) => {
				player.sendMessage(`§9${id}: §a${value}`);
			});
			break;
		}
		case "catch:warps": {
			// Send a message indicating the event has been received.
			world.sendMessage(`§6[New Pack]Received warp info for ${player.nameTag}.`);

			// Get all the tags from the the player starting with "transfer_warp:"
			let transferWarpTags = player.getTags().filter((tag) => tag.startsWith("transfer_warp:"));

			// Iterate the tags.
			transferWarpTags.forEach((tag) => {
				try {
					// Get the JSON string from the tag.
					let jsonString = tag.split("transfer_warp:")[1];

					let transferredWarp = warpifyString(jsonString);
					addWarp(player, transferredWarp);

					player.removeTag(tag);
				} catch (error) {
					world.sendMessage(`§c[New Pack]Could not parse warp transfer: for ${player.nameTag}: ${error.message}`);
				}
			});

			// Send a message confirming the operation was completed.
			world.sendMessage(`§6[New Pack]Finished. Transferred ${transferWarpTags.length} warps from the old pack.`);
			break;
		}
		case "clear:transfer": {
			// Get all the tags from the the player starting with "transfer_warp:"
			let transferWarpTags = player.getTags().filter((tag) => tag.startsWith("transfer_warp:"));

			transferWarpTags.forEach((tag) => {
				player.removeTag(tag);
			});
			player.sendMessage(`[System] §cCleared ${transferWarpTags.length} transferred warps from ${player.nameTag}.`);
			break;
		}
		case "give:book": {
			// If there is no player name given, give the item to the player who sent the command.
			if (!message) {
				getEntityContainer(player).addItem(createWarpBook());
				return;
			}

			// If the message is "all" give a warp book to all players currently in the world.
			if (message === "all") {
				// Get a list of all players.
				const playerList = world.getAllPlayers();

				playerList.forEach((listPlayer) => getEntityContainer(listPlayer).addItem(createWarpBook()));
				return;
			}

			// If it's not all, try to find a player with this name.
			const foundPlayer = getPlayerShortName(message);

			// If a player could not be found, tell the player and end execution.
			if (!foundPlayer) {
				player.sendMessage(`§cCould not find a player from name: ${message}`);
				return;
			}

			// Give a warp book to that player.
			getEntityContainer(foundPlayer).addItem(createWarpBook());

			player.sendMessage(`§6Gave a warp book to: §e${foundPlayer.nameTag}`);
		}
	}
});

function createWarpBook() {
	let warpBook = new ItemStack("realm:warp_book", 1);
	warpBook.keepOnDeath = true;

	return warpBook;
}

/**
 * Attempts to find a player with a phrase at the start of their username.
 * @param {string} shortName - The prefix to search for in player usernames.
 * @returns {Player | undefined} - The matching player object or undefined if none is found.
 */
function getPlayerShortName(shortName) {
	// Get a list of all players.
	const playerList = world.getAllPlayers();

	// Force the short name to all lowercase so the comparison is not case sensitive because thats annoying.
	const shortNameLower = shortName.toLowerCase();

	// Filter the list of players, looking for one who's name, forced to lowercase, starts with the short name.
	const foundPlayer = playerList.find((player) => player.nameTag.toLowerCase().startsWith(shortNameLower));

	// Returns the player if found, or undefined otherwise.
	return foundPlayer;
}
