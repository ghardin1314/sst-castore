import { Command, tuple } from "@castore/core";
import { pokemonEventStore } from "../pokemon/event-store";
import { z } from "zod";

export const levelUpPokemonInputSchema = z.object({
  pokemonId: z.string(),
});

export const levelUpPokemonOutputSchema = z.object({
  nextLevel: z.number(),
});

export const levelUpPokemonCommand = new Command({
  commandId: "LEVEL_UP_POKEMON",
  requiredEventStores: tuple(pokemonEventStore),
  handler: async (
    { pokemonId }: z.infer<typeof levelUpPokemonInputSchema>,
    [pokemons]
  ): Promise<z.infer<typeof levelUpPokemonOutputSchema>> => {
    const { aggregate } = await pokemons.getExistingAggregate(pokemonId);

    if (aggregate.level === 99) {
      throw new Error(`Pokemon ${pokemonId} is already at max level`);
    }

    const { nextAggregate } = await pokemons.pushEvent(
      {
        aggregateId: pokemonId,
        version: aggregate.version + 1,
        type: "POKEMON_LEVELLED_UP",
      },
      {
        prevAggregate: aggregate,
      }
    );

    if (!nextAggregate) {
      throw new Error(`Pokemon ${pokemonId} not found`);
    }

    return {
      nextLevel: nextAggregate.level,
    };
  },
});
