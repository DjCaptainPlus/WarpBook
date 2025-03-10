import { ModalFormData } from "@minecraft/server-ui";
import { ModalUISlider } from "./ModalUISlider";
import { world } from "@minecraft/server";
import { ModalUITextfield } from "./ModalUITextfield";
import { ModalUIToggle } from "./ModalUIToggle";
import { ModalUIDropdown } from "./ModalUIDropdown";

export class ModalUI {
	constructor() {
		/**
		 * The title to display at the top of the UI.
		 * @type {string}
		 */
		this.title = undefined;

		/**
		 * An array of modal UI elements.
		 * @type {Array<ModalUISlider|ModalUITextfield|ModalUIToggle|ModalUIDropdown>}
		 */
		this.elements = [];

		/**
		 * Function to handle form submission.
		 * @type {Function}
		 */
		this.submitCallback = undefined;

		/**
		 * The text displayed in the submit button.
		 * @type {string}
		 */
		this.submitLabel = undefined;
	}

	/**
	 * Sets the UI title.
	 * @param {string} title
	 */
	setTitle(title) {
		// Ensure the provided title is a string.
		if (typeof title !== "string") {
			throw new Error("ModalUI title must be a string.");
		}

		// Make sure the title isn't an empty string.
		if (title === "") {
			throw new Error("ModalUI must have a title.");
		}

		// Set the UI's title.
		this.title = title;
	}

	/**
	 * Sets the label for the submit button.
	 * @param {string} label
	 */
	setSubmitLabel(label) {
		// Ensure the provided label is a string.
		if (typeof label !== "string") {
			throw new Error("ModalUI submit label must be a string.");
		}

		this.submitLabel = label;
	}

	/**
	 * Creates a new slider on the UI.
	 * @returns {ModalUISlider}
	 */
	addSlider() {
		// Create a new slider.
		let newSlider = new ModalUISlider();

		// Add the new slider to the list of elements on the UI.
		this.elements.push(newSlider);

		// Return the slider instance.
		return newSlider;
	}

	/**
	 * Creates a new textfield on the UI.
	 * @returns {ModalUITextfield}
	 */
	addTextfield() {
		// Create a new textfield.
		let newTextfield = new ModalUITextfield();

		// Add the new textfield to the list of elements on the UI.
		this.elements.push(newTextfield);

		// Return the textfield instance.
		return newTextfield;
	}

	/**
	 * Creates a new toggle on the UI.
	 * @returns {ModalUIToggle}
	 */
	addToggle() {
		// Create a new toggle.
		let newToggle = new ModalUIToggle();

		// Add the new toggle to the list of elements on the UI.
		this.elements.push(newToggle);

		// Return the toggle instance.
		return newToggle;
	}

	/**
	 * Creates a new dropdown list on the UI.
	 * @returns {ModalUIDropdown}
	 */
	addDropdown() {
		// Create a new dropdown.
		let newDropdown = new ModalUIDropdown();

		// Add the new toggle to the list of elements on the UI.
		this.elements.push(newDropdown);

		return newDropdown;
	}

	/**
	 * The function to be run upon form submission.
	 * @param {Function} func
	 */
	onSubmit(func) {
		// Ensure the provided function is a valid function.
		if (typeof func !== "function") {
			throw new Error("onSubmit callback must be a function.");
		}

		// Store the function for later use.
		this.submitCallback = func;
	}

	/**
	 * Displays the UI to the given player.
	 * @param {Player} player
	 */
	show(player) {
		let UI = buildModalUI(this);

		UI.show(player).then((response) => {
			// Handle UI response
			if (response.canceled) {
				return;
			}

			// List of UI element values from the response.
			let elementValues = response.formValues;

			// Iterate through the elements on this UI and check if the values have changed.
			for (let i = 0; i < this.elements.length; i++) {
				let currentElement = this.elements[i];

				// Determine what kind of UI element this is.

				// If the element is a slider.
				if (currentElement instanceof ModalUISlider) {
					let newSliderValue = elementValues[i];

					if (currentElement.value !== newSliderValue) {
						// Store the old and new values
						let oldValue = currentElement.value;
						let newValue = newSliderValue;

						// If an update callback has been defined, call it
						if (currentElement.updateCallback) {
							currentElement.updateCallback(oldValue, newValue);
						}
					}
				} else if (currentElement instanceof ModalUITextfield) {
					let newTextfieldValue = elementValues[i];

					if (currentElement.value !== newTextfieldValue) {
						// Store the old and new values
						let oldValue = currentElement.value;
						let newValue = newTextfieldValue;

						// If an update callback has been defined, call it
						if (currentElement.updateCallback) {
							currentElement.updateCallback(oldValue, newValue);
						}
					}
				} else if (currentElement instanceof ModalUIToggle) {
					let newToggleValue = elementValues[i];

					if (currentElement.value !== newToggleValue) {
						// Store the old and new values
						let oldValue = currentElement.value;
						let newValue = newToggleValue;

						// If an update callback has been defined, call it
						if (currentElement.updateCallback) {
							currentElement.updateCallback(oldValue, newValue);
						}
					}
				} else if (currentElement instanceof ModalUIDropdown) {
					let newDropdownValue = elementValues[i];
					if (currentElement.value !== newDropdownValue) {
						// Store the old and new values
						let oldValue = currentElement.value;
						let newValue = newDropdownValue;

						// If an update callback has been defined, call it
						if (currentElement.updateCallback) {
							currentElement.updateCallback(currentElement.dropdownOptions[oldValue], currentElement.dropdownOptions[newValue]);
						}
					}
				}
			}

			// Run the onSubmit function, if there is one.
			if (this.submitCallback) {
				this.submitCallback();
			}
		});
	}
}

/**
 * Constructs a ModalFormData instance from the given ModalUI
 * to be displayed in Minecraft.
 * @param {ModalUI} modalUI
 */
function buildModalUI(modalUI) {
	// Create a ModalFormData.
	let UI = new ModalFormData();

	// Set the UI's title.
	UI.title(modalUI.title);

	if (modalUI.submitLabel) {
		UI.submitButton(modalUI.submitLabel);
	}

	if (!modalUI.elements[0]) {
		throw new Error("Modal UI must have at least one UI element.");
	}

	// Iterate through the list of UI elements.
	for (let element of modalUI.elements) {
		// Determine what kind of UI element this is.

		// If the element is a slider.
		if (element instanceof ModalUISlider) {
			UI.slider(element.label, element.min, element.max, element.step, element.value);
		} else if (element instanceof ModalUITextfield) {
			UI.textField(element.label, element.placeholderText, element.defaultValue);
		} else if (element instanceof ModalUIToggle) {
			UI.toggle(element.label, element.defaultValue);
		} else if (element instanceof ModalUIDropdown) {
			let dropdownOptionLabels = [];
			element.dropdownOptions.forEach((option) => dropdownOptionLabels.push(option.label));
			UI.dropdown(element.label, dropdownOptionLabels, element.defaultIndex);
		}
	}

	return UI;
}
