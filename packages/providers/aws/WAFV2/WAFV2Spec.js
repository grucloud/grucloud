const { omitIfEmpty } = require("@grucloud/core/Common");
const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep, first, prepend, values } = require("rubico/x");

const { isOurMinion, compareAws } = require("../AwsCommon");
const { WAFV2WebACL } = require("./WAFV2WebACL");
const { WAFV2WebACLCloudFront } = require("./WAFV2WebACLCloudFront");

const {
  WAFV2WebACLAssociation,
  WebAclDependencies,
} = require("./WAFV2WebACLAssociation");

const GROUP = "WAFv2";

const tagsKey = "Tags";
const compareWAFV2 = compareAws({ tagsKey });

const filterDescription = omitIfEmpty(["Description"]);
const omitPropertiesWebACL = ["ARN", "Id", "LockToken", "LabelNamespace"];

module.exports = pipe([
  () => [
    {
      type: "WebACL",
      Client: WAFV2WebACL,
      omitProperties: omitPropertiesWebACL,
      compare: compareWAFV2({
        filterLive: () => pipe([filterDescription]),
      }),
      filterLive: () => pipe([filterDescription]),
    },
    {
      type: "WebACLCloudFront",
      Client: WAFV2WebACLCloudFront,
      omitProperties: omitPropertiesWebACL,
      compare: compareWAFV2({
        filterLive: () => pipe([filterDescription]),
      }),
      filterLive: () => pipe([filterDescription]),
    },
    {
      type: "WebACLAssociation",
      Client: WAFV2WebACLAssociation,
      omitProperties: ["ResourceArn", "WebACLArn"],
      inferName: ({ dependenciesSpec: { webAcl, ...otherDeps } }) =>
        pipe([
          () => otherDeps,
          values,
          first,
          tap((dep) => {
            assert(dep);
          }),
          prepend(`webacl-assoc::${webAcl}::`),
        ])(),
      dependencies: {
        webAcl: {
          type: "WebACL",
          group: GROUP,
          dependencyId: ({ lives, config }) => get("WebACLArn"),
        },
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
