import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { EventStack } from "./stacks/EventStack";

export default {
  config(_input) {
    return {
      name: "sst-castore",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(EventStack).stack(ApiStack);
  },
} satisfies SSTConfig;
