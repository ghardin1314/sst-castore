import z from "zod";
import { ZodEventType } from "@castore/zod-event";

export const gameStartedEvent = new ZodEventType({
  type: "GAME_STARTED",
  payloadSchema: z.object({
    trainerName: z.string(),
  }),
});

export const pokemonCaughtEvent = new ZodEventType({
  type: "POKEMON_CAUGHT",
  payloadSchema: z.object({
    pokemonId: z.string(),
  }),
});
