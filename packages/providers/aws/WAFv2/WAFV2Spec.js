const { omitIfEmpty } = require("@grucloud/core/Common");
const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { WAFV2WebACL } = require("./WAFV2WebAcl");
const { WAFV2WebACLCloudFront } = require("./WAFV2WebACLCloudFront");

const { WAFV2WebACLAssociation } = require("./WAFV2WebAclAssociation");

const GROUP = "WAFv2";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey });

const { createAwsService } = require("../AwsService");

module.exports = pipe([
  () => [
    WAFV2WebACL({ compare }),
    WAFV2WebACLCloudFront({ compare }),
    WAFV2WebACLAssociation({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        isOurMinion,
        tagsKey,
        compare: compare({}),
      }),
    ])
  ),
]);
