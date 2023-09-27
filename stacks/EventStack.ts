import { EventBus, StackContext } from "sst/constructs";

export function EventStack({ stack }: StackContext) {
  const eventBus = new EventBus(stack, "AppEventBus", {
    rules: {
      projections: {
        pattern: {
          source: ["TRAINERS", "POKEMONS"],
        },
        targets: {
          projection: "packages/functions/src/projections.handler",
        },
      },
    },
  });

  return {
    eventBus,
  };
}
