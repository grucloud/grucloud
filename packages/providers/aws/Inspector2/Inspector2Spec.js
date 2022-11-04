const assert = require("assert");
const { map, pipe, tap, get, omit, eq } = require("rubico");
const { defaultsDeep, isEmpty, when } = require("rubico/x");

const { compareAws } = require("../AwsCommon");

const {
  Inspector2DelegatedAdminAccount,
} = require("./Inspector2DelegatedAdminAccount");
const { Inspector2Enabler } = require("./Inspector2Enabler");

const GROUP = "Inspector2";

const tagsKey = "Tags";

const compareInspector2 = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    {
      type: "DelegatedAdminAccount",
      Client: Inspector2DelegatedAdminAccount,
      inferName: () => "default",
      omitProperties: ["status"],
      propertiesDefault: {},
    },
    {
      type: "Enabler",
      Client: Inspector2Enabler,
      ignoreResource: () => pipe([get("live.resourceTypes"), isEmpty]),
      inferName: () => "default",
      compare: compareInspector2({
        filterAll: () => pipe([omit(["accountIds"])]),
      }),
      omitProperties: ["state"],
      propertiesDefault: {},
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compareInspector2({}),
    })
  ),
]);
