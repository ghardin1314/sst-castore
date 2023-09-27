import { StateCarryingMessageBus } from "@castore/core";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { EventBridgeMessageBusAdapter } from "@castore/event-bridge-message-bus-adapter";

import { EventBus } from "sst/node/event-bus";

import { pokemonEventStore } from "../pokemon";
import { trainersEventStore } from "../trainers";

const eventBridgeClient = new EventBridgeClient({});

const messageBusAdapter = new EventBridgeMessageBusAdapter({
  eventBridgeClient,
  eventBusName: EventBus.AppEventBus.eventBusName,
});

export const appMessageBus = new StateCarryingMessageBus({
  messageBusId: "APP_MESSAGE_BUS",
  sourceEventStores: [pokemonEventStore, trainersEventStore],
  messageBusAdapter,
});

