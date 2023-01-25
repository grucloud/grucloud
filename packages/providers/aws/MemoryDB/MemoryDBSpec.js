const assert = require("assert");
const { tap, pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");
const GROUP = "MemoryDB";
const tagsKey = "Tags";
const compare = compareAws({ tagsKey, key: "Key" });

const { MemoryDBACL } = require("./MemoryDBACL");
const { MemoryDBCluster } = require("./MemoryDBCluster");
const { MemoryDBParameterGroup } = require("./MemoryDBParameterGroup");
const { MemoryDBSubnetGroup } = require("./MemoryDBSubnetGroup");
const { MemoryDBUser } = require("./MemoryDBUser");

module.exports = pipe([
  () => [
    MemoryDBACL({ compare }),
    MemoryDBCluster({ compare }),
    MemoryDBParameterGroup({ compare }),
    MemoryDBSubnetGroup({ compare }),
    MemoryDBUser({ compare }),
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
