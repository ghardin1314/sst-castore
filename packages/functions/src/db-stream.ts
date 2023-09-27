import { appMessageBus } from "@sst-castore/core/resources/event-bus";
import { DynamoDBStreamEvent } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const handler = async (event: DynamoDBStreamEvent) => {
  for (const record of event.Records) {
    if (!record.dynamodb?.NewImage) continue;

    const event = unmarshall(
      record.dynamodb.NewImage as Record<string, AttributeValue>
    );

    const [eventStoreId, aggregateId] = event.aggregateId.split("#");

    const version = event.version;

    await appMessageBus.getAggregateAndPublishMessage({
      eventStoreId,
      event: {
        aggregateId,
        type: event.type,
        version,
        payload: event.payload,
        metadata: event.metadata,
        timestamp: event.timestamp,
      },
    });
  }
};
