const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const GROUP = "SSMIncidents";
const tagsKey = "tags";
const compare = compareAws({ tagsKey });

const { SSMIncidentsReplicationSet } = require("./SSMIncidentsReplicationSet");
const { SSMIncidentsResponsePlan } = require("./SSMIncidentsResponsePlan");

module.exports = pipe([
  () => [
    //
    SSMIncidentsReplicationSet({}),
    SSMIncidentsResponsePlan({}),
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
