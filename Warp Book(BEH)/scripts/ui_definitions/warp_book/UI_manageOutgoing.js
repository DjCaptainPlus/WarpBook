import { deleteTeleportRequest, getOutgoingTPRequest, getPlayerByName, isPlayerOnline } from "../../functions/TeleportRequestFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";
import { UI_Root } from "./UI_root";

/**
 * UI for managing a player's outgoing teleport requests.
 * @param {Player} player
 */
export function UI_ManageOutgoing(player) {
	try {
		const teleportRequest = getOutgoingTPRequest(player);

		const manageOutgoing = new ActionUI();
		manageOutgoing.setTitle(`Outgoing request to ${teleportRequest.to}`);

		let cancelButton = manageOutgoing.addButton();
		cancelButton.setLabel("§l§cCancel Request");
		cancelButton.onClick(() => {
			// Fetch both players.
			let senderPlayer = getPlayerByName(teleportRequest.from);
			let receiverPlayer = getPlayerByName(teleportRequest.to);

			// Send both players a message.
			receiverPlayer.sendMessage(`§c${senderPlayer.nameTag} canceled their teleport request.`);
			senderPlayer.sendMessage(`§cCanceled teleport request to ${receiverPlayer.nameTag}`);

			// Delete the request
			deleteTeleportRequest(teleportRequest);
		});

		let returnButton = manageOutgoing.addButton();
		returnButton.setLabel("§l§2Go Back");
		returnButton.onClick(() => {
			UI_Root(player);
		});

		manageOutgoing.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_ManageOutgoing to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
