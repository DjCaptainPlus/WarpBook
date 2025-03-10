import { ModalUIDropdownOption } from "./ModalUIDropdownOption";

export class ModalUIDropdown {
	constructor() {
		/**
		 * The text displayed on the dropdown.
		 * @type {string}
		 */
		this.label = undefined;

		/**
		 * The index of the default selection.
		 */
		this.defaultIndex = undefined;

		/**
		 * List of options for the dropdown.
		 * @type {Array<ModalUIDropdownOption>}
		 */
		this.dropdownOptions = [];

		/**
		 * The value for the slider.
		 * @type {number}
		 */
		this.value = undefined;

		/**
		 * Function to handle value changes.
		 * @type {Function}
		 */
		this.updateCallback = undefined;
	}

	/**
	 * Sets the text displayed on the dropdown.
	 * @param {string} label
	 */
	setLabel(label) {
		// Ensure the provided label argument is a string.
		if (typeof label !== "string") {
			throw new Error("Dropdown label must be a string.");
		}

		this.label = label;
	}

	/**
	 * Adds an option to the dropdown.
	 * @param {ModalUIDropdownOption} option
	 */
	addOption(id, label) {
		this.dropdownOptions.push(new ModalUIDropdownOption(id, label, this.dropdownOptions.length));
	}

	/**
	 * Sets the default selection index for the dropdown.
	 * @param {number} default
	 */
	setDefault(value) {
		// If the value is a string, search for an option with that id.
		if (typeof value === "string") {
			let index = this.dropdownOptions.findIndex((option) => option.id === value);

			// If the index is not found, it will return -1.
			if (index < 0) {
				throw new Error(`Could not find dropdown option with id: ${value}. Did you set the default value before defining options?`);
			}

			this.defaultIndex = index;
			this.value = index;
		} else if (typeof value === "number") {
			this.defaultIndex = value;
			this.value = value;
		} else {
			throw new Error(`Could not set default value for dropdown. Must be an element index or option id string.`);
		}
	}

	/**
	 * @callback sliderUpdateCallback
	 * @param {ModalUIDropdownOption} oldValue
	 * @param {ModalUIDropdownOption} newValue
	 */

	/**
	 * The function to be run upon value updating.
	 * @param {sliderUpdateCallback} func
	 */
	onUpdate(func) {
		// Ensure the provided function is a valid function.
		if (typeof func !== "function") {
			throw new Error("onUpdate callback must be a function.");
		}

		// Store the function for later use.
		this.updateCallback = func;
	}
}
