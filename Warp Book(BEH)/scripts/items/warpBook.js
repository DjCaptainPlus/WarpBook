import { ItemComponentUseEvent, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { ModalUI } from "../ui_engine/ModalUI";
import { hasSetting } from "../functions/SettingsFunctions";
import { UI_Root } from "../ui_definitions/warp_book/UI_root";

let color = "blue";

export const WarpBook = {
	/**
	 *
	 * @param {ItemComponentUseEvent} event
	 */
	onUse: (event) => {
		const player = event.source;

		player.playSound("item.book.page_turn");
		UI_Root(player);
	}
};
