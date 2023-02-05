const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Schemas.html

const { SchemasDiscoverer } = require("./SchemasDiscoverer");
const { SchemasRegistry } = require("./SchemasRegistry");
const { SchemasRegistryPolicy } = require("./SchemasRegistryPolicy");
const { SchemasSchema } = require("./SchemasSchema");

const GROUP = "EventSchemas";

const compare = compareAws({});

module.exports = pipe([
  () => [
    SchemasDiscoverer({}),
    SchemasRegistry({}),
    SchemasRegistryPolicy({}),
    SchemasSchema({}),
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
    })
  ),
]);
