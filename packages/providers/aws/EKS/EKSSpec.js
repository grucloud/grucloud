const assert = require("assert");
const { pipe, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const { EKSAddon } = require("./EKSAddon");
const { EKSCluster } = require("./EKSCluster");
const { EKSFargateProfile } = require("./EKSFargateProfile");
const { EKSIdentityProviderConfig } = require("./EKSIdentityProviderConfig");
const { EKSNodeGroup } = require("./EKSNodeGroup");

const GROUP = "EKS";
const tagsKey = "tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    EKSAddon({ compare }),
    EKSCluster({ compare }),
    EKSFargateProfile({ compare }),
    EKSIdentityProviderConfig({ compare }),
    EKSNodeGroup({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
