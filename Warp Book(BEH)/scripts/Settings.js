/**
 * @typedef {Object} Settings
 * @property {Object} autoAccept - The settings related to auto-accept functionality.
 * @property {string} autoAccept.id - The unique identifier for the auto-accept feature.
 * @property {boolean} autoAccept.default - The default value for auto-accepting teleport requests.
 */

/**
 * @type {Settings}
 */
export const Settings = {
	autoAccept: {
		id: `auto_accept_tp_requests`,
		default: false
	},
	quickWarpMode: {
		id: `quick_warp_mode`,
		default: "disabled"
	}
};
