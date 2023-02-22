const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const { LambdaAlias } = require("./LambdaAlias");
const { LambdaEventSourceMapping } = require("./LambdaEventSourceMapping");
const { LambdaFunction } = require("./Function");
const { LambdaLayer } = require("./Layer");
const { LambdaPermission } = require("./LambdaPermission");

const GROUP = "Lambda";
const compare = compareAws({});

module.exports = pipe([
  () => [
    LambdaAlias({}),
    LambdaEventSourceMapping({ compare }),
    LambdaFunction({}),
    LambdaLayer({}),
    LambdaPermission({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
