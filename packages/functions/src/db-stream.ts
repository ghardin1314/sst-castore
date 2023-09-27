import {
  pokemonEventStore,
  trainersEventStore,
} from "@sst-castore/core/resources/db";
import { appMessageBus } from "@sst-castore/core/resources/event-bus";
import { DynamoDBStreamEvent } from "aws-lambda";

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    console.log(JSON.stringify(record.dynamodb?.NewImage, null, 2));

    const img = record.dynamodb?.NewImage;

    const eventStoreId = img?.eventStoreId.S as "POKEMONS" | "TRAINERS";
    const eventType = img?.type.S;
    const aggregateId = img?.aggregateId.S?.replace(`${eventStoreId}#`, "");
    const version = Number(img?.version.N);

    let aggregate, lastEvent;

    switch (eventStoreId) {
      case "TRAINERS":
        ({ aggregate, lastEvent } = await trainersEventStore.getAggregate(
          aggregateId as string,
          { maxVersion: version }
        ));
        if (!aggregate || !lastEvent) break;
        appMessageBus.getAggregateAndPublishMessage({
          eventStoreId,
          event: lastEvent,
        });
        await appMessageBus.publishMessage({
          eventStoreId,
          event: lastEvent,
          aggregate,
        });
        break;
      case "POKEMONS": {
        ({ aggregate, lastEvent } = await pokemonEventStore.getAggregate(
          aggregateId as string,
          { maxVersion: version }
        ));
        if (!aggregate || !lastEvent) break;
        await appMessageBus.publishMessage({
          eventStoreId,
          event: lastEvent,
          aggregate,
        });
        break;
      }
      default:
        break;
    }

    console.log({ aggregate, lastEvent });

    if (!eventStoreId || !eventType || !aggregate || !lastEvent) continue;
  }
};
