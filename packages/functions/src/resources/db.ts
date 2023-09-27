import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDbSingleTableEventStorageAdapter } from "@castore/dynamodb-event-storage-adapter";
import { Table } from "sst/node/table";

import { pokemonEventStore as $pokemonEventStore } from "@sst-castore/core/pokemon";
import { trainersEventStore as $trainersEventStore } from "@sst-castore/core/trainers";

export const dynamoDbClient = new DynamoDBClient({});

const storageAdapter = new DynamoDbSingleTableEventStorageAdapter({
  tableName: Table.EventStore.tableName,
  dynamoDbClient,
});

export const pokemonEventStore = $pokemonEventStore;
export const trainersEventStore = $trainersEventStore;

pokemonEventStore.storageAdapter = storageAdapter;
trainersEventStore.storageAdapter = storageAdapter;
