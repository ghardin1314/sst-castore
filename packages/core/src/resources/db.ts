import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDbSingleTableEventStorageAdapter } from "@castore/dynamodb-event-storage-adapter";
import { Table } from "sst/node/table";

import { pokemonEventStore as $pokemonEventStore } from "../pokemon";
import { trainersEventStore as $trainersEventStore } from "../trainers";

export const dynamoDbClient = new DynamoDBClient({});

const storageAdapter = new DynamoDbSingleTableEventStorageAdapter({
  tableName: Table.EventStore.tableName,
  dynamoDbClient,
});

export const pokemonEventStore = $pokemonEventStore;
export const trainersEventStore = $trainersEventStore;

pokemonEventStore.storageAdapter = storageAdapter;
trainersEventStore.storageAdapter = storageAdapter;
