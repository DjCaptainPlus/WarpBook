export class ModalUISlider {
	constructor() {
		/**
		 * The text displayed on the slider.
		 * @type {string}
		 */
		this.label = undefined;

		/**
		 * The minimum value for the slider.
		 * @type {number}
		 */
		this.min = undefined;

		/**
		 * The maximum value for the slider.
		 * @type {number}
		 */
		this.max = undefined;

		/**
		 * The step value for the slider.
		 * @type {number}
		 */
		this.step = undefined;

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
	 * Sets the text displayed on the slider.
	 * @param {string} label
	 */
	setLabel(label) {
		// Ensure the provided label argument is a string.
		if (typeof label !== "string") {
			throw new Error("Slider label must be a string.");
		}

		this.label = label;
	}

	/**
	 * Sets the minimum value for the slider.
	 * @param {number} minValue
	 */
	setMin(minValue) {
		// Ensure the value provided is a number.
		if (typeof minValue !== "number") {
			throw new Error("Slider minimum value must be a number");
		}

		this.min = minValue;
	}

	/**
	 * Sets the maximum value for the slider.
	 * @param {number} maxValue
	 */
	setMax(maxValue) {
		// Ensure the value provided is a number.
		if (typeof maxValue !== "number") {
			throw new Error("Slider maximum value must be a number");
		}

		this.max = maxValue;
	}

	/**
	 * Sets the step value for the slider.
	 * @param {number} stepValue
	 */
	setStep(stepValue) {
		// Ensure the value provided is a number.
		if (typeof stepValue !== "number") {
			throw new Error("Step maximum value must be a number");
		}

		this.step = stepValue;
	}

	/**
	 * Sets the value for the slider.
	 * @param {number} value
	 */
	setValue(value) {
		// Ensure the value provided is a number.
		if (typeof value !== "number") {
			throw new Error("Slider value must be a number");
		}

		this.value = value;
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
