export class ModalUIToggle {
	constructor() {
		/**
		 * The text displayed on the toggle.
		 * @type {string}
		 */
		this.label = undefined;

		/**
		 * The default value for the toggle.
		 * @type {boolean}
		 */
		this.defaultValue = undefined;

		/**
		 * The value for the toggle.
		 * @type {boolean}
		 */
		this.value = undefined;

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
			throw new Error("Toggle label must be a string.");
		}

		this.label = label;
	}

	/**
	 * Sets the default value for the toggle.
	 * @param {boolean} value
	 */
	setDefaultValue(value) {
		// Ensure the provided value argument is a boolean.
		if (typeof value !== "boolean") {
			throw new Error("Toggle default value must be a boolean.");
		}

        this.defaultValue = value;
		this.value = value;
	}

	/**
	 * @callback sliderUpdateCallback
	 * @param {boolean} oldValue
	 * @param {boolean} newValue
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