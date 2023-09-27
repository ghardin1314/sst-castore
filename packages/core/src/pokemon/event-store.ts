import { EventStore } from "@castore/core";

import type { PokemonAggregate } from "./aggregate";
import { appearedEvent, caughtByTrainerEvent, levelledUpEvent } from "./events";

export const pokemonEventStore = new EventStore({
  eventStoreId: "POKEMONS",
  eventStoreEvents: [appearedEvent, caughtByTrainerEvent, levelledUpEvent],
  reduce: (aggregate: PokemonAggregate, event) => {
    const { version, aggregateId } = event;

    switch (event.type) {
      case "POKEMON_APPEARED": {
        const { name, level } = event.payload;
        return {
          ...aggregate,
          aggregateId,
          version,
          name,
          level,
          status: "wild",
        };
      }
      case "POKEMON_CAUGHT_BY_TRAINER": {
        const { trainerId } = event.payload;
        return {
          ...aggregate,
          aggregateId,
          version,
          trainerId,
          status: "caught",
        };
      }
      case "POKEMON_LEVELLED_UP": {
        return {
          ...aggregate,
          aggregateId,
          version,
          level: aggregate.level + 1,
        };
      }
    }
  },
});
