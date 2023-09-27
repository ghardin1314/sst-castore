import { StackContext, Table, TableProps } from "sst/constructs";

const eventStoreTableProps: TableProps = {
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
  stream: "new_image",
};

export function StorageStack({ stack }: StackContext) {
  const eventStoreTable = new Table(stack, "EventStore", eventStoreTableProps);

  return {
    eventStoreTable,
  };
}
