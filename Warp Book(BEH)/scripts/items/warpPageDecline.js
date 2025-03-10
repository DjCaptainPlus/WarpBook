import { ItemComponentUseEvent } from "@minecraft/server";
import { declineAllTeleportRequests, getIncomingTPRequests } from "../functions/TeleportRequestFunctions";

export const WarpPageDecline = {
	/**
	 * @param {ItemComponentUseEvent} eventData
	 */
	onUse: (eventData) => {
		const player = eventData.source;

		let incomingRequests = getIncomingTPRequests(player);

		if (incomingRequests && !player.isSneaking) {
			declineAllTeleportRequests(incomingRequests);
		}
	}
};
