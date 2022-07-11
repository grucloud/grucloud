const assert = require("assert");
const { assign, map, pipe, tap, get, and, or, switchCase } = require("rubico");
const { defaultsDeep, when, callProp, isString } = require("rubico/x");

const {
  isOurMinion,
  compareAws,
  replaceArnWithAccountAndRegion,
} = require("../AwsCommon");
const { WAFV2WebAcl } = require("./WAFV2WebAcl");
const {
  WAFV2WebAclAssociation,
  WebAclDependencies,
} = require("./WAFV2WebAclAssociation");

const GROUP = "WAFV2";

const tagsKey = "Tags";
const compareWAFV2 = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "WebAcl",
      Client: WAFV2WebAcl,
      omitProperties: ["Id"],
    },
    {
      type: "WebAclAssociation",
      Client: WAFV2WebAclAssociation,
      omitProperties: ["ResourceArn", "WebACLArn"],
      dependencies: {
        webACL: { type: "WebAcl", group: GROUP },
        ...WebAclDependencies,
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      tagsKey,
      compare: compareWAFV2({}),
    })
  ),
]);
