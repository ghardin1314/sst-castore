import { APIGatewayProxyEvent } from "aws-lambda";
import { randomUUID } from "crypto";
import {
  wildPokemonAppearCommand,
  wildPokemonAppearInputSchema,
} from "@sst-castore/core/commands/wild-pokemon-appear";
import { pokemonEventStore } from "@sst-castore/core/resources/db";

export const handler = async (event: APIGatewayProxyEvent) => {
  const input = wildPokemonAppearInputSchema.parse(JSON.parse(event.body!));

  const { pokemonId } = await wildPokemonAppearCommand.handler(
    input,
    [pokemonEventStore],
    {
      generateUuid: randomUUID,
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      pokemonId,
    }),
  };
};
