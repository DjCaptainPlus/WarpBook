import { ItemComponentUseEvent } from "@minecraft/server";
import { acceptAllTeleportRequests, getIncomingTPRequests } from "../functions/TeleportRequestFunctions";

export const WarpPageAccept = {
    /**
     * @param {ItemComponentUseEvent} eventData 
     */
    onUse: (eventData) => {
      const player = eventData.source;

      let incomingRequests = getIncomingTPRequests(player);

      if (incomingRequests && !player.isSneaking) {
         acceptAllTeleportRequests(incomingRequests);
      }

     
		}
}