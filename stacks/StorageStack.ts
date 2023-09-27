import { StackContext, Table, TableProps, use } from "sst/constructs";
import { EventStack } from "./EventStack";

export function StorageStack({ stack }: StackContext) {
  const { eventBus } = use(EventStack);

  const eventStoreTable = new Table(stack, "EventStore", {
    fields: {
      aggregateId: "string",
      version: "number",
      eventStoreId: "string",
      timestamp: "string",
    },
    primaryIndex: {
      partitionKey: "aggregateId",
      sortKey: "version",
    },
    globalIndexes: {
      initialEvents: {
        partitionKey: "eventStoreId",
        sortKey: "timestamp",
        projection: "keys_only",
      },
    },
    stream: true, // only care about new_image but isnt invoking handler
  });

  eventStoreTable.addConsumers(stack, {
    consumer1: {
      function: {
        handler: "packages/functions/src/db-stream.handler",
        bind: [eventBus, eventStoreTable],
        retryAttempts: 3,
        // deadLetterQueue: true // Need to configure
      },
    },
  });

  return {
    eventStoreTable,
  };
}
