const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { isOurMinionFactory, compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { DBCluster } = require("./DBCluster");
const { RDSClusterEndpoint } = require("./RDSClusterEndpoint");
const { RDSEventSubscription } = require("./RDSEventSubscription");

const { RDSDBEngineVersion } = require("./RDSDBEngineVersion");

const { DBInstance } = require("./DBInstance");
const { RDSDBSubnetGroup } = require("./RDSDBSubnetGroup");
const { DBProxy } = require("./DBProxy");
const { DBProxyTargetGroup } = require("./DBProxyTargetGroup");
const { RDSDBClusterParameterGroup } = require("./RDSDBClusterParameterGroup");

const GROUP = "RDS";
const compareRDS = compareAws({});

module.exports = pipe([
  () => [
    DBProxy({}),
    DBProxyTargetGroup({}),
    DBCluster({ compare: compareRDS }),
    RDSClusterEndpoint({ compare: compareRDS }),
    RDSDBEngineVersion({ compare: compareRDS }),
    RDSDBClusterParameterGroup({ compare: compareRDS }),
    RDSDBSubnetGroup({ compare: compareRDS }),
    DBInstance({ compare: compareRDS }),
    RDSEventSubscription({ compare: compareRDS }),
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
