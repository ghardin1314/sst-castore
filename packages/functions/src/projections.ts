import type { EventBridgeMessageBusMessage } from "@castore/event-bridge-message-bus-adapter";
import { appMessageBus } from "@sst-castore/core/resources/event-bus";

export const handler = async (
  message: EventBridgeMessageBusMessage<typeof appMessageBus>
) => {
	
  /** @todo Write Projections to read db (sql, mongo, etc) */
  switch (message.source) {
    case "TRAINERS":
      switch (message["detail-type"]) {
        case "GAME_STARTED":
          console.log("Trainer created", message.detail.aggregate);
          break;
        case "POKEMON_CAUGHT":
          console.log("Pokemon caught", message.detail.aggregate);
          break;
      }
      break;
    case "POKEMONS":
      switch (message["detail-type"]) {
        case "POKEMON_APPEARED":
          console.log("Pokemon appeared", message.detail.aggregate);
          break;
        case "POKEMON_CAUGHT_BY_TRAINER":
          console.log("Pokemon caught by trainer", message.detail.aggregate);
          break;
        case "POKEMON_LEVELLED_UP":
          console.log("Pokemon levelled up", message.detail.aggregate);
          break;
      }
      break;
  }
};
