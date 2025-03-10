import { Player, world } from "@minecraft/server";
import { fetchSetting, updateSetting } from "../../functions/SettingsFunctions";
import { ModalUI } from "../../ui_engine/ModalUI";

/**
 * UI for the settings menu.
 * @param {Player} player
 */
export function UI_Settings(player) {
	try {
		const settings = new ModalUI();
		settings.setTitle("Settings");

		const autoAcceptToggle = settings.addToggle();
		autoAcceptToggle.setLabel("Accept All Teleport Requests");
		autoAcceptToggle.setDefaultValue(fetchSetting(player, "auto_accept_tp_requests"));
		autoAcceptToggle.onUpdate((oldValue, newValue) => {
			updateSetting(player, "auto_accept_tp_requests", newValue);
		});

        const quickWarp = settings.addDropdown();
        quickWarp.setLabel("Quick Warp Mode")
        quickWarp.addOption("disabled", "Disabled");
        quickWarp.addOption("last_warp", "Last Used Warp");
        quickWarp.addOption("select", "Select Warp");
        quickWarp.setDefault(fetchSetting(player,'quick_warp_mode'));
        quickWarp.onUpdate((oldValue,newValue) => {
            updateSetting(player,'quick_warp_mode',newValue.id);
        })

		settings.show(player);
	} catch (error) {
		throw new Error(`Could not display UI_Settings to ${player.nameTag}: ${error.message}${error.stack}`);
	}
}
