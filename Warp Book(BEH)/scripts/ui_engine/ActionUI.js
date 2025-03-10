import { ActionFormData } from "@minecraft/server-ui";
import { ActionUIButton } from "./ActionUIButton";
import { Player, world } from "@minecraft/server";

/**
 * 
 * Defines a class for creating an action form UI with built in functions.
 */
export class ActionUI {
	constructor() {
		/**
		 * The title to display at the top of the UI.
		 * @type {string}
		 */
		this.title = undefined;

		/**
		 * An array of the buttons attached to the UI.
		 * @type {Array<ActionUIButton>}
		 */
		this.buttons = [];

		/**
		 * The body text
		 * @type {string}
		 */
		this.body = undefined;
	}

	/**
	 * Sets the UI title.
	 * @param {string} title
	 */
	setTitle(title) {
		// Ensure the provided title is a string.
		if (typeof title !== "string") {
			throw new Error("ActionUI title must be a string.");
		}

		// Make sure the title isn't an empty string.
		if (title === "") {
			throw new Error("ActionUI must have a title.");
		}

		// Set the UI's title.
		this.title = title;
	}

	/**
	 * Sets the body text.
	 * @param {string} text 
	 */
	setBody(text) {
		// Ensure the provided text is a string.
		if (typeof text !== "string") {
			throw new Error("ActionUI body text must be a string.");
		}

		this.body = text;
	}

	/**
	 * Creates and add a new button to the UI.
	 * @returns {ActionUIButton} The created button instance.
	 */
	addButton() {
		// Create a new instance of an ActionUIButton.
		let newButton = new ActionUIButton();

		// Add the button to the list of buttons on the UI.
		this.buttons.push(newButton);

		// Return the new button.
		return newButton;
	}

	/**
	 * Displays the UI to the given player.
	 * @param {Player} player
	 */
	show(player) {
		let UI = buildActionUI(this);

		UI.show(player).then((response) => {
			// Handle response to UI buttons.
			if (response.canceled) {
				return;
			}

			// Get the index of the button that was clicked.
			let buttonIndex = response.selection;

			// Get the ActionUIButton instance at that index.
			/**@type {ActionUIButton} */
			let selectedButton = this.buttons[buttonIndex];

			// A button doesn't have to have a onClick function, so check if this one does.
			if (selectedButton.clickFunction) {
				// If there is an onClick function, run it.
				selectedButton.clickFunction();
			}
		});
	}
}

/**
 * Constructs an ActionFormData instance from the given ActionUI
 * to be displayed in Minecraft.
 * @param {ActionUI} actionUI
 */
function buildActionUI(actionUI) {
	// Create an instance of ActionFormData.
	let UI = new ActionFormData();

	// Set the UI's title.
	UI.title(actionUI.title);

	if (actionUI.body) {
		UI.body(actionUI.body)
	}

	if (!actionUI.buttons[0]) {
		throw new Error("ActionUI must have at least one button.");
	}

	// Iterate through the list of buttons on the ActionUI and add each to the ActionFormData.
	for (let button of actionUI.buttons) {
		// Get the label set on the current button.
		let currentButtonLabel = button.label;

		// If the current button's label is undefined or an empty string, throw an error.
		if (!currentButtonLabel) {
			throw new Error("Button must have a label.");
		}

		// Get the icon path of the current button.
		let currentButtonIconPath = button.iconPath;

		// Add the button to the Action Form Data.
		UI.button(currentButtonLabel, currentButtonIconPath);
	}

	return UI;
}
