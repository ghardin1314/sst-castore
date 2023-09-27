import { Command, tuple } from "@castore/core";
import { z } from "zod";
import { trainersEventStore } from "../trainers/event-store";

export const startGameInputSchema = z.object({
  trainerName: z.string(),
});

export const startGameOutputSchema = z.object({
  trainerId: z.string(),
});

export const startGameCommand = new Command({
  commandId: "START_POKEMON_GAME",
  requiredEventStores: tuple(trainersEventStore),
  handler: async (
    { trainerName }: z.infer<typeof startGameInputSchema>,
    [trainers],
    { generateUuid }: { generateUuid: () => string }
  ): Promise<z.infer<typeof startGameOutputSchema>> => {
    const trainerId = generateUuid();

    await trainers.pushEvent({
      aggregateId: trainerId,
      version: 1,
      type: "GAME_STARTED",
      payload: {
        trainerName,
      },
    });

    return {
      trainerId,
    };
  },
});
