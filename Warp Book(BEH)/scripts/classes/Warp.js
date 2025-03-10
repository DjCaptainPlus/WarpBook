import { Dimension } from "@minecraft/server";
import { toTitleCase } from "../functions/StringFunctions";
import { validateWarpData } from "../functions/WarpFunctions";

/**
 * @typedef {Object} Vector3
 * @prop {number} x
 * @prop {number} y
 * @prop {number} z
 */

export class Warp {
	/**
	 * Creates a new Warp instance.
	 *
	 * @param {Vector3} location - The coordinates of the warp.
	 * @param {string} dimensionId - The ID of the dimension where the warp is saved.
	 * @param {string} name - The name of the warp.
	 * @param {boolean} favorite - Indicates if the warp is marked as a favorite.
	 * @param {boolean} [global=false] - Indicates if the warp is accessible globally. Defaults to false.
	 * @param {string} [ownerName] - The name of the player who created the warp. Optional.
	 */
	constructor(location, dimensionId, name, favorite, ownerName,global = false) {
		validateLocation(location);
		validateDimension(dimensionId);
		validateName(name);
		validateFavorite(favorite);

		/**
		 * The Vector3 location where the warp is saved.
		 * @type {Vector3}
		 */
		this.location = location;

		/**
		 * The ID of the dimension where this warp is saved.
		 * @type {string}
		 */
		this.dimensionId = dimensionId;

		/**
		 * The name of the warp, formatted in title case.
		 * @type {string}
		 */
		this.name = toTitleCase(name);

		/**
		 * Indicates if the warp is marked as a favorite.
		 * @type {boolean}
		 */
		this.favorite = favorite;

		/**
		 * Indicates if the warp is accessible globally.
		 * @type {boolean}
		 */
		this.global = global;

		/**
		 * The name of the player who created the warp.
		 * @type {string}
		 */
		this.ownerName = ownerName;
	}
}

function validateLocation(location) {
	if (typeof location !== "object" || typeof location.x !== "number" || typeof location.y !== "number" || typeof location.z !== "number") {
		throw new Error("Invalid location: must be a Vector3 object.");
	}
}

function validateDimension(dimensionId) {
	if (typeof dimensionId !== "string") {
		throw new Error("Invalid dimension: Wait how did you even do that...?");
	}
}

function validateName(name) {
	if (typeof name !== "string") {
		throw new Error("Invalid name: must be a string.");
	}
}

function validateFavorite(favorite) {
	if (typeof favorite !== "boolean") {
		throw new Error("Invalid favorite value: must be a boolean.");
	}
}
