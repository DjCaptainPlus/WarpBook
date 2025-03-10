export class ActionUIButton {
	constructor() {
		/**
		 * The text displayed on the button.
		 * @type {string}
		 */
		this.label;

		/**
		 * The path to the button's icon.
		 * @type {string}
		 */
		this.iconPath = undefined;

		/**
		 * The function to be run when the button is clicked.
		 * @type {Function}
		 */
		this.clickFunction;
	}

	/**
	 * Sets the text displayed on the button.
	 * @param {string} label
	 */
	setLabel(label) {
		// Ensure the provided label argument is a string.
		if (typeof label !== "string") {
			throw new Error("Button label must be a string.");
		}

		// Set the button's label.
		this.label = label;
	}

	/**
	 * Sets the path to the button's icon.
	 * Assumes file is located in 'textures/icons/'.
	 * @param {string} filename
	 */
	setIconFile(filename) {
		// Ensure the provided filename is a string.
		if (typeof filename !== "string") {
			throw new Error("Icon filename must be a string.");
		}

		// Default location for icons.
		let iconsFolderPath = "textures/icons/";

		// The complete path to the icon image.
		let fullIconPath = iconsFolderPath + filename;

		// Set the button's icon path to this full path.
		this.iconPath = fullIconPath;
	}

	/**
	 * Sets the function to be run when the button is clicked.
	 * @param {function} func - The function to be executed when the button is clicked.
	 */
	onClick(func) {
		if (typeof func !== "function") {
			throw new Error("onClick must be a function.");
		}

		this.clickFunction = func;
	}
}
