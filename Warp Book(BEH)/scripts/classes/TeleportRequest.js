import { Player, system, world } from "@minecraft/server";
import { deleteTeleportRequest, getPlayerByName } from "../functions/TeleportRequestFunctions";

export class TeleportRequest {
	/**
	 * Creates a new teleport request.
	 * @param {string} fromPlayerName
	 * @param {string} toPlayerName
	 */
	constructor(fromPlayerName, toPlayerName, id = undefined) {
		/**
		 * The player the request was sent from.
		 * @type {Player}
		 */
		this.from = fromPlayerName;

		/**
		 * The player the request was sent to.
		 * @type {Player}
		 */
		this.to = toPlayerName;

		/**
		 * The unique identifier for the teleport request.
		 * @type {number}
		 */
		this.id = id;
	}

	/**
	 * Sends the teleport request.
	 */
	send() {
		const senderPlayer = getPlayerByName(this.from);
		const receiverPlayer = getPlayerByName(this.to);

		// Create the expiration timer for 60 seconds, and save it's id.
		let timerId = system.runTimeout(() => {
			// Upon timeout, inform both players.

			senderPlayer.sendMessage(`§6Teleport request to §e${this.to}§6 has expired.`);
			receiverPlayer.sendMessage(`§6Teleport request from §e${this.from}§6 has expired.`);

			// Delete the request
			deleteTeleportRequest(this);
		}, 1200);

		// Set the timerId to the request's id.
		this.id = timerId;

		// Save the request as a world property.
		world.setDynamicProperty(`tp_request:${timerId}`, JSON.stringify(this));

		// Send the players a message.
		senderPlayer.sendMessage(`§6You requested to teleport to §e${this.to}.§6\nThis request will expire in 60 seconds.`);
		receiverPlayer.sendMessage(`§e${this.from}§6 has requested to teleport to you. §aAccept§6 or §cdecline§6 using your §5Warp Book§6.\nThis request will expire in 60 seconds`);
	}
}
