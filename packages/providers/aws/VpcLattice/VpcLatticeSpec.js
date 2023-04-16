const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  VpcLatticeAccessLogSubscription,
} = require("./VpcLatticeAccessLogSubscription");

const { VpcLatticeAuthPolicy } = require("./VpcLatticeAuthPolicy");
const { VpcLatticeListener } = require("./VpcLatticeListener");
const { VpcLatticeResourcePolicy } = require("./VpcLatticeResourcePolicy");
const { VpcLatticeRule } = require("./VpcLatticeRule");
const { VpcLatticeService } = require("./VpcLatticeService");
const { VpcLatticeServiceNetwork } = require("./VpcLatticeServiceNetwork");
const {
  VpcLatticeServiceNetworkServiceAssociation,
} = require("./VpcLatticeServiceNetworkServiceAssociation");
const {
  VpcLatticeServiceNetworkVpcAssociation,
} = require("./VpcLatticeServiceNetworkVpcAssociation");
const { VpcLatticeTargetGroup } = require("./VpcLatticeTargetGroup");

const GROUP = "VpcLattice";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const { createAwsService } = require("../AwsService");

module.exports = pipe([
  () => [
    //
    VpcLatticeAccessLogSubscription({ compare }),
    VpcLatticeAuthPolicy({ compare }),
    VpcLatticeListener({ compare }),
    VpcLatticeRule({ compare }),
    VpcLatticeResourcePolicy({ compare }),
    VpcLatticeService({ compare }),
    VpcLatticeServiceNetwork({ compare }),
    VpcLatticeServiceNetworkServiceAssociation({ compare }),
    VpcLatticeServiceNetworkVpcAssociation({ compare }),
    VpcLatticeTargetGroup({ compare }),
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
