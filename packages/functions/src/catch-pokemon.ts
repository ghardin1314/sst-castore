import { APIGatewayProxyEvent } from "aws-lambda";
import {
  catchPokemonCommand,
  catchPokemonInputSchema,
} from "@sst-castore/core/commands/catch-pokemon";
import { pokemonEventStore, trainersEventStore } from "src/resources/db";

export const handler = async (event: APIGatewayProxyEvent) => {
  const input = catchPokemonInputSchema.parse(JSON.parse(event.body!));

  await catchPokemonCommand.handler(input, [
    pokemonEventStore,
    trainersEventStore,
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Pokemon caught",
    }),
  };
};
