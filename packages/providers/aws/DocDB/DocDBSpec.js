const assert = require("assert");
const { map, pipe } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { DocDBDBCluster } = require("./DocDBDBCluster");
const {
  DocDBDBClusterParameterGroup,
} = require("./DocDBDBClusterParameterGroup");
const { DocDBDBClusterSnapshot } = require("./DocDBDBClusterSnapshot");
const { DocDBDBInstance } = require("./DocDBDBInstance");
const { DocDBDBSubnetGroup } = require("./DocDBDBSubnetGroup");
const { DocDBEventSubscription } = require("./DocDBEventSubscription");
const { DocDBGlobalCluster } = require("./DocDBGlobalCluster");

const GROUP = "DocDB";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    DocDBDBCluster({ compare }),
    DocDBDBClusterParameterGroup({}),
    DocDBDBClusterSnapshot({}),
    DocDBDBInstance({}),
    DocDBDBSubnetGroup({}),
    DocDBEventSubscription({}),
    DocDBGlobalCluster({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, compare: compare({}) }),
    ])
  ),
]);
