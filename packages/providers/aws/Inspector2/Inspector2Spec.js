const assert = require("assert");
const { map, pipe, tap, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const {
  Inspector2DelegatedAdminAccount,
} = require("./Inspector2DelegatedAdminAccount");
const { Inspector2Enabler } = require("./Inspector2Enabler");
const {
  Inspector2OrganizationConfiguration,
} = require("./Inspector2OrganizationConfiguration");

const GROUP = "Inspector2";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    Inspector2DelegatedAdminAccount({ compare }),
    Inspector2Enabler({ compare }),
    Inspector2OrganizationConfiguration({ compare }),
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
