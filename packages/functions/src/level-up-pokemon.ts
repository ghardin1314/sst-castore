import {
  levelUpPokemonCommand,
  levelUpPokemonInputSchema,
} from "@sst-castore/core/commands/level-up-pokemon";
import { pokemonEventStore } from "@sst-castore/core/resources/db";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {
  const input = levelUpPokemonInputSchema.parse(JSON.parse(event.body!));

  const { nextLevel } = await levelUpPokemonCommand.handler(input, [
    pokemonEventStore,
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      nextLevel,
    }),
  };
};
