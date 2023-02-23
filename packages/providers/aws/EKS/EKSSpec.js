const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { isOurMinionObject } = require("../AwsCommon");

const { EKSAddon } = require("./EKSAddon");
const { EKSCluster } = require("./EKSCluster");
const { EKSFargateProfile } = require("./EKSFargateProfile");

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
    EKSFargateProfile({ compare }),
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
