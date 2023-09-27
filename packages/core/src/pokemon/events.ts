import z from "zod";
import { ZodEventType } from "@castore/zod-event";

export const appearedEvent = new ZodEventType({
  type: "POKEMON_APPEARED",
  payloadSchema: z.object({
    name: z.string(),
    level: z.number(),
  }),
  metadataSchema: z.object({
    trigger: z.enum(["random", "scripted"]).optional(),
  }),
});

export const caughtByTrainerEvent = new ZodEventType({
  type: "POKEMON_CAUGHT_BY_TRAINER",
  payloadSchema: z.object({
    trainerId: z.string(),
  }),
});

export const levelledUpEvent = new ZodEventType({
  type: "POKEMON_LEVELLED_UP",
});
