import { Command, tuple } from "@castore/core";
import { z } from "zod";
import { pokemonEventStore } from "../pokemon/event-store";

export const wildPokemonAppearInputSchema = z.object({
  name: z.string(),
  level: z.number(),
});

export const wildPokemonAppearOutputSchema = z.object({
  pokemonId: z.string(),
});

export const wildPokemonAppearCommand = new Command({
  commandId: "WILD_POKEMON_APPEAR",
  requiredEventStores: tuple(pokemonEventStore),
  handler: async (
    { name, level }: z.infer<typeof wildPokemonAppearInputSchema>,
    [pokemonEventStore],
    { generateUuid }: { generateUuid: () => string }
  ): Promise<z.infer<typeof wildPokemonAppearOutputSchema>> => {
    const pokemonId = generateUuid();

    await pokemonEventStore.pushEvent({
      aggregateId: pokemonId,
      version: 1,
      type: "POKEMON_APPEARED",
      payload: {
        name,
        level,
      },
      metadata: {
        trigger: "scripted",
      },
    });

    return {
      pokemonId,
    };
  },
});
