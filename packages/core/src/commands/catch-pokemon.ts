import { Command, EventStore, tuple } from "@castore/core";
import { pokemonEventStore } from "../pokemon/event-store";
import { z } from "zod";
import { trainersEventStore } from "../trainers/event-store";

export const catchPokemonInputSchema = z.object({
  pokemonId: z.string(),
  trainerId: z.string(),
});

export const catchPokemonCommand = new Command({
  commandId: "CATCH_POKEMON",
  requiredEventStores: tuple(pokemonEventStore, trainersEventStore),
  handler: async (
    { pokemonId, trainerId }: z.infer<typeof catchPokemonInputSchema>,
    [pokemons, trainers]
  ): Promise<void> => {
    const [{ aggregate: pokemon }, { aggregate: trainer }] = await Promise.all([
      pokemons.getAggregate(pokemonId, {}),
      trainers.getAggregate(trainerId),
    ]);

    if (!pokemon) {
      throw new Error(`Pokemon ${pokemonId} not found`);
    }
    if (!trainer) {
      throw new Error(`Trainer ${trainerId} not found`);
    }
    if (pokemon.status === "CAUGHT") {
      throw new Error(`Pokemon ${pokemonId} already caught`);
    }

    await EventStore.pushEventGroup(
      pokemons.groupEvent({
        aggregateId: pokemonId,
        version: pokemon.version + 1,
        type: "POKEMON_CAUGHT_BY_TRAINER",
        payload: {
          trainerId,
        },
      }),
      trainers.groupEvent({
        aggregateId: trainerId,
        version: trainer.version + 1,
        type: "POKEMON_CAUGHT",
        payload: {
          pokemonId,
        },
      })
    );
  },
});
