import { ActionFormData } from "@minecraft/server-ui";
import { acceptTeleportRequest, declineTeleportRequest, getIncomingTPRequests } from "../../functions/TeleportRequestFunctions";
import { ActionUI } from "../../ui_engine/ActionUI";
import { UI_Root } from "./UI_root";

/**
 * UI for managing the list of incoming teleport requests.
 * @param {Player} player
 */
export function UI_ManageIncoming(player) {
	try {
		const manageIncoming = new ActionUI();
		manageIncoming.setTitle("Manage Incoming Teleport Requests");

		let incomingRequests = getIncomingTPRequests(player);

		incomingRequests.forEach((request) => {
			const requestButton = manageIncoming.addButton();
			requestButton.setLabel(`From ${request.from}`);
			requestButton.onClick(() => {
				// Display an options dialog.
				const requestOptions = new ActionUI();
				requestOptions.setTitle(`Teleport Request from ${request.from}`);

				const acceptButton = requestOptions.addButton();
				acceptButton.setLabel("§l§2Accept");
                acceptButton.setIconFile("accept.png")
				acceptButton.onClick(() => {
					acceptTeleportRequest(request);
				});

				const declineButton = requestOptions.addButton();
				declineButton.setLabel("§l§cDecline");
                declineButton.setIconFile("decline.png")
				declineButton.onClick(() => {
					declineTeleportRequest(request)
				});

				requestOptions.show(player);
			});
		});

        manageIncoming.show(player)
	} catch (error) {
		throw new Error(`Could not display UI_ManageIncoming to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
