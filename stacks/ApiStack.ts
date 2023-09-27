import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { eventStoreTable } = use(StorageStack);

  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [eventStoreTable],
      },
    },
    routes: {
      "POST /start": "packages/functions/src/start-pokemon-game.handler",
      "POST /wild-pokemon-appear":
        "packages/functions/src/wild-pokemon-appear.handler",
      "POST /catch-pokemon": "packages/functions/src/catch-pokemon.handler",
      "POST /level-up-pokemon":
        "packages/functions/src/level-up-pokemon.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
