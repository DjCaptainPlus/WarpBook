export class ModalUITextfield {
	constructor() {
		/**
		 * The text displayed on the slider.
		 * @type {string}
		 */
		this.label = undefined;

		/**
		 * Placeholder text to be shown when the textfield is empty.
		 * @type {string}
		 */
		this.placeholderText = "";

		/**
		 * The default text in the textfield.
		 * @type {string}
		 */
		this.defaultValue = undefined;

		/**
		 * The value for the textfield.
		 * @type {string}
		 */
		this.value = "";

		/**
		 * Function to handle value changes.
		 * @type {Function}
		 */
		this.updateCallback = undefined;
	}

	/**
	 * Sets the text displayed on the textfield.
	 * @param {string} label
	 */
	setLabel(label) {
		// Ensure the provided label argument is a string.
		if (typeof label !== "string") {
			throw new Error("Textfield label must be a string.");
		}

		this.label = label;
	}

	/**
	 * Sets the placeholder text for the textfield.
	 * @param {String} text
	 */
	setPlaceholderText(text) {
		// Ensure the provided text argument is a string.
		if (typeof text !== "string") {
			throw new Error("Textfield placeholder must be a string.");
		}

		this.placeholderText = text;
	}

	/**
	 * Sets the default text for the textfield.
	 * @param {String} text
	 */
	setDefaultValue(text) {
		// Ensure the provided text argument is a string.
		if (typeof text !== "string") {
			throw new Error("Textfield default value must be a string.");
		}

		this.defaultValue = text;
		this.value = text;
	}

	/**
	 * @callback sliderUpdateCallback
	 * @param {number} oldValue - The previous value of the slider.
	 * @param {number} newValue - The new value of the slider.
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
