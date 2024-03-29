const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { WAFV2IPSet } = require("./WAFV2IPSet");
const { WAFV2LoggingConfiguration } = require("./WAFV2LoggingConfiguration");

const { WAFV2RegexPatternSet } = require("./WAFV2RegexPatternSet");
const { WAFV2RuleGroup } = require("./WAFV2RuleGroup");
const { WAFV2WebACL } = require("./WAFV2WebAcl");
const { WAFV2WebACLCloudFront } = require("./WAFV2WebACLCloudFront");

const { WAFV2WebACLAssociation } = require("./WAFV2WebAclAssociation");

const GROUP = "WAFv2";

const tagsKey = "Tags";
const compare = compareAws({ tagsKey });

const { createAwsService } = require("../AwsService");

module.exports = pipe([
  () => [
    WAFV2IPSet({ compare }),
    WAFV2LoggingConfiguration({ compare }),
    WAFV2RuleGroup({}),
    WAFV2RegexPatternSet({ compare }),
    WAFV2WebACL({ compare }),
    WAFV2WebACLCloudFront({ compare }),
    WAFV2WebACLAssociation({ compare }),
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
