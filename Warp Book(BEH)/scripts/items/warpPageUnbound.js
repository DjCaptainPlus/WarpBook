import { ItemComponentUseEvent } from "@minecraft/server";
import { UI_WarpPageSelect } from "../ui_definitions/warp_page/UI_WarpPageSelect";

export const WarpPageUnbound = {
	/**
	 * @param {ItemComponentUseEvent} eventData
	 */
	onUse: (eventData) => {
		const player = eventData.source;
		const item = eventData.itemStack;

		UI_WarpPageSelect(player);
	}
};
