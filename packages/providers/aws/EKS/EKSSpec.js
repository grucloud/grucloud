const assert = require("assert");
const { pipe, map, pick, omit, tap, not, get, eq, assign } = require("rubico");
const { defaultsDeep, when, pluck, find } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { isOurMinionObject } = require("../AwsCommon");

const { EKSAddon } = require("./EKSAddon");
const { EKSCluster } = require("./EKSCluster");
const { EKSNodeGroup } = require("./EKSNodeGroup");

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const GROUP = "EKS";
const tagsKey = "tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    EKSAddon({ compare }),
    EKSCluster({ compare }),
    EKSNodeGroup({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        isOurMinion,
        compare: compare({}),
      }),
    ])
  ),
]);
