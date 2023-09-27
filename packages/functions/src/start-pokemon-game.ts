import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import {
  startGameCommand,
  startGameInputSchema,
} from "@sst-castore/core/commands/start-pokemon-game";
import { trainersEventStore } from "@sst-castore/core/resources/db";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  const input = startGameInputSchema.parse(JSON.parse(event.body!));
  const { trainerId } = await startGameCommand.handler(
    input,
    [trainersEventStore],
    {
      generateUuid: randomUUID,
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      trainerId,
    }),
  };
};
