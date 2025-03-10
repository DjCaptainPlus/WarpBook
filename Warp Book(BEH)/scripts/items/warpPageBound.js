import { ItemComponentUseEvent } from "@minecraft/server";
import { teleportToWarp, warpifyString } from "../functions/WarpFunctions";

export const WarpPageBound = {
	/**
	 * @param {ItemComponentUseEvent} eventData
	 */
	onUse: (eventData) => {
		const player = eventData.source;
		const item = eventData.itemStack;

		let warpString = item.getDynamicProperty(`page:warp`);

		let warp = warpifyString(warpString);

		if (!player.isSneaking) {
			teleportToWarp(player, warp);
		}
	}
};
