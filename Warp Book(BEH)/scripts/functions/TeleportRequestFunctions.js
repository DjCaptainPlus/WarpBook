import { Player, system, world } from "@minecraft/server";
import { TeleportRequest } from "../classes/TeleportRequest";
import { teleportPlayerToPlayer } from "./PlayerFunctions";

/**
 * Gets a list of all teleport requests on the world.
 * @returns {Array<TeleportRequest>|undefined} An array of teleport requests, or undefined if there are none.
 */
export function getTeleportRequests() {
	// Get a list of all dynamic properties on the world.
	let worldPropertyList = world.getDynamicPropertyIds();

	// Filter the list to get only teleport requests.
	let teleportRequestIdList = worldPropertyList.filter((propertyId) => propertyId.startsWith("tp_request:"));

	// Array to store instances of TeleportRequest after they're parsed from JSON data.
	let teleportRequestList = [];

	// If any teleport requests were found, iterate through the list of them.
	if (teleportRequestIdList.length) {
		for (let tpRequestId of teleportRequestIdList) {
			try {
				// Get the stored JSON data.
				let JSONData = world.getDynamicProperty(tpRequestId);

				// Parse the data
				let teleportRequest = parseTeleportRequest(JSONData);

				// Insert the request into the list.
				teleportRequestList.push(teleportRequest);
			} catch (error) {
				throw new Error(`Could not parse teleport request: ${error.message}${error.stack}`);
			}
		}
	}

	if (teleportRequestList.length) {
		return teleportRequestList;
	} else {
		return undefined;
	}
}

/**
 * Gets a list of incoming teleport requests the player has.
 * @param {Player} player
 * @returns {Array<TeleportRequest>|undefined} An array of incoming teleport requests, or undefined if there are none.
 */
export function getIncomingTPRequests(player) {
	// Get a list of all teleport requests.
	let teleportRequestList = getTeleportRequests();

	// If there are no teleport requests, return undefined.
	if (!teleportRequestList) {
		return undefined;
	}

	// Filter the list to get only the ones in which the 'to' player name matches the given player.
	let incomingRequests = teleportRequestList.filter((tpRequest) => tpRequest.to === player.nameTag);

	// If no incoming requests were found, return undefined.
	if (!incomingRequests.length) {
		return undefined;
	}

	return incomingRequests;
}

/**
 * Gets the outgoing teleport request from a player.
 * @param {Player} player
 */
export function getOutgoingTPRequest(player) {
	// Get a list of all teleport requests.
	let teleportRequestList = getTeleportRequests();

	// If there are no teleport requests, return undefined.
	if (!teleportRequestList) {
		return undefined;
	}

	// Filter the list to find the one where the 'from' player name matches the given player.
	let outgoingRequest = teleportRequestList.find((tpRequest) => tpRequest.from === player.nameTag);

	return outgoingRequest;
}

/**
 * Parses a string of JSON data into a TeleportRequest.
 * @param {string} dataString
 */
export function parseTeleportRequest(dataString) {
	// Validate the JSON string.
	validateTeleportRequestJSON(dataString);

	// Parse the string.
	let data = JSON.parse(dataString);

	const fromPlayerName = data.from;
	const toPlayerName = data.to;
	const id = data.id;

	// Create an instance of TeleportRequest.
	let teleportRequest = new TeleportRequest(fromPlayerName, toPlayerName, id);

	return teleportRequest;
}

/**
 * Validates a JSON string representing a Teleport Request.
 * @param {string} dataString
 */
export function validateTeleportRequestJSON(dataString) {
	try {
		let data = JSON.parse(dataString);

		if (!("from" in data)) {
			throw new Error(`Teleport Request has no 'from' property.`);
		}
		if (!("to" in data)) {
			throw new Error(`Teleport Request has no 'to' property.`);
		}
		if (!("id" in data)) {
			throw new Error(`Teleport Request has no 'id' property.`);
		}

		if (typeof data.from !== "string") {
			throw new Error("Teleport request 'from' is not a string.");
		}
		if (typeof data.to !== "string") {
			throw new Error("Teleport request 'to' is not a string.");
		}
		if (!data.id) {
			throw new Error("Teleport request has no id.");
		}
	} catch (error) {
		throw new Error(`Could not validate TP request string: ${error.message}${error.stack}`);
	}
}

/**
 * Handles a teleport request based on the specified action.
 * @param {TeleportRequest} teleportRequest - The teleport request to handle.
 * @param {string} action - The action to perform ('accept' or 'decline').
 * @param {boolean} [sendMessage=true] - Whether to send a message to the players.
 */
function handleTeleportRequest(teleportRequest, action, sendMessage = true) {
	const senderName = teleportRequest.from;
	const receiverName = teleportRequest.to;

	// Check that both players are still online.
	if (!isPlayerOnline(senderName)) {
		if (sendMessage) {
			receiverName.sendMessage(`§c${senderName} is not online.`);
		}
		deleteTeleportRequest(teleportRequest);
		return;
	}

	if (!isPlayerOnline(receiverName)) {
		deleteTeleportRequest(teleportRequest);
		return;
	}

	let senderPlayer = getPlayerByName(senderName);
	let receiverPlayer = getPlayerByName(receiverName);

	if (action === "accept") {
		// Teleport the sender to the receiver.
		teleportPlayerToPlayer(senderPlayer,receiverPlayer);

		if (sendMessage) {
			// Send both players a message.
			senderPlayer.sendMessage(`§a${receiverName} accepted your teleport request.`);
			receiverPlayer.sendMessage(`§a${senderName} teleported to you.`);
		}
	} else if (action === "decline") {
		if (sendMessage) {
			senderPlayer.sendMessage(`§c${receiverName} declined your teleport request.`);
		}
	}

	// Delete the request.
	deleteTeleportRequest(teleportRequest);
}

/**
 * Accepts a teleport request and teleports the player.
 * @param {TeleportRequest} teleportRequest - The teleport request to accept.
 * @param {boolean} [sendMessage=true] - Whether to send a message to the players.
 */
export function acceptTeleportRequest(teleportRequest, sendMessage = true) {
	handleTeleportRequest(teleportRequest, "accept", sendMessage);
}

/**
 * Declines a teleport request.
 * @param {TeleportRequest} teleportRequest - The teleport request to decline.
 * @param {boolean} [sendMessage=true] - Whether to send a message to the players.
 */
export function declineTeleportRequest(teleportRequest, sendMessage = true) {
	handleTeleportRequest(teleportRequest, "decline", sendMessage);
}

/**
 * General function to handle all teleport requests
 * @param {Array<TeleportRequest>} incomingRequests
 * @param {Player} player
 * @param {string} action
 */
function handleAllTeleportRequests(incomingRequests, player, action) {
	incomingRequests.forEach((request) => {
		try {
			// Get the player who sent the request.
			let sender = getPlayerByName(request.from);

			// If the sending player is online, perform the specified action.
			if (isPlayerOnline(request.from)) {
				if (action === "accept") {
					acceptTeleportRequest(request, false);
					sender.sendMessage(`§a${player.nameTag} accepted your teleport request.`);
				} else if (action === "decline") {
					declineTeleportRequest(request, false);
					sender.sendMessage(`§c${player.nameTag} declined your teleport request.`);
				}
			} else {
				// Delete the request if the sending player is not online.
				deleteTeleportRequest(request);
			}
		} catch (error) {
			player.sendMessage(`§c Unable to ${action} teleport request from ${request.from}`);
			console.error(`Could not ${action} teleport request: ${error.message}${error.stack}`);
		}
	});

	// Send the receiving player a message indicating completion of the action
	player.sendMessage(`§a${action === "accept" ? "Accepted" : "Declined"} all teleport requests.`);
}

// Function to accept all teleport requests
export function acceptAllTeleportRequests(incomingRequests, player) {
	handleAllTeleportRequests(incomingRequests, player, "accept");
}

// Function to decline all teleport requests
export function declineAllTeleportRequests(incomingRequests, player) {
	handleAllTeleportRequests(incomingRequests, player, "decline");
}

/**
 * Deletes a teleport request.
 * @param {TeleportRequest} teleportRequest
 */
export function deleteTeleportRequest(teleportRequest) {
	// Make sure there is a world dynamic property for the teleport request.
	let worldPropertyList = world.getDynamicPropertyIds();
	let foundProperty = worldPropertyList.find((propertyId) => propertyId == `tp_request:${teleportRequest.id}`);

	// If the property is not found, throw an error.
	if (!foundProperty) {
		throw new Error(`Cannot delete teleport request '${teleportRequest.id}' because it doesn't exist.`);
	}

	// If the request is found, first cancel its timer.
	let timerId = teleportRequest.id;
	system.clearRun(timerId);

	// Then delete the request
	world.setDynamicProperty(`tp_request:${teleportRequest.id}`, undefined);
}

/**
 * Checks to see if a player with the given name is on the world.
 * @param {string} playerName The name of the player to check for.
 * @returns {boolean} True if the player is on the world, false if they are not.
 */
export function isPlayerOnline(playerName) {
	// Get a list of players on the world.
	let playerList = world.getAllPlayers();

	// Try to find a player with the given name.
	let foundPlayer = playerList.find((player) => player.nameTag === playerName);

	// Return true or false.
	return foundPlayer ? true : false;
}

/**
 * Gets a player from their name.
 * @param {string} playerName
 * @returns {Player|undefined} Returns the player if found, or undefined otherwise.
 */
export function getPlayerByName(playerName) {
	// Get a list of players on the world.
	let playerList = world.getAllPlayers();

	// Try to find a player with the given name.
	let foundPlayer = playerList.find((player) => player.nameTag === playerName);

	return foundPlayer;
}
