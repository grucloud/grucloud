const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isOurMinionFactory, compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { RDSDBCluster } = require("./RDSDBCluster");
const { RDSDBClusterEndpoint } = require("./RDSDBClusterEndpoint");
const { RDSDBClusterParameterGroup } = require("./RDSDBClusterParameterGroup");
const { RDSDBClusterSnapshot } = require("./RDSDBClusterSnapshot");
const { RDSDBEngineVersion } = require("./RDSDBEngineVersion");
const { RDSDBInstance } = require("./RDSDBInstance");
const { RDSDBSubnetGroup } = require("./RDSDBSubnetGroup");
const { RDSDBProxy } = require("./RDSDBProxy");
const { RDSDBProxyTargetGroup } = require("./RDSDBProxyTargetGroup");
const { RDSDBSnapshot } = require("./RDSDBSnapshot");
const { RDSEventSubscription } = require("./RDSEventSubscription");
const { RDSGlobalCluster } = require("./RDSGlobalCluster");

const GROUP = "RDS";
const compareRDS = compareAws({});

module.exports = pipe([
  () => [
    RDSDBCluster({ compare: compareRDS }),
    RDSDBClusterEndpoint({ compare: compareRDS }),
    RDSDBClusterParameterGroup({ compare: compareRDS }),
    RDSDBClusterSnapshot({}),
    RDSDBEngineVersion({ compare: compareRDS }),
    RDSDBInstance({ compare: compareRDS }),
    RDSDBProxy({}),
    RDSDBProxyTargetGroup({}),
    RDSDBSnapshot({}),
    RDSDBSubnetGroup({ compare: compareRDS }),
    RDSEventSubscription({ compare: compareRDS }),
    RDSGlobalCluster({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compareRDS({}),
        isOurMinion: isOurMinionFactory({ tags: "TagList" }),
      }),
    ])
  ),
]);
