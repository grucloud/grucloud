const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");
const { compareAws } = require("../AwsCommon");

const GROUP = "OpenSearchServerless";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });

const {
  OpenSearchServerlessAccessPolicy,
} = require("./OpenSearchServerlessAccessPolicy");
const {
  OpenSearchServerlessCollection,
} = require("./OpenSearchServerlessCollection");
const {
  OpenSearchServerlessSecurityConfig,
} = require("./OpenSearchServerlessSecurityConfig");
const {
  OpenSearchServerlessSecurityPolicy,
} = require("./OpenSearchServerlessSecurityPolicy");
const {
  OpenSearchServerlessVpcEndpoint,
} = require("./OpenSearchServerlessVpcEndpoint");

module.exports = pipe([
  () => [
    OpenSearchServerlessAccessPolicy({ compare }),
    OpenSearchServerlessCollection({ compare }),
    OpenSearchServerlessSecurityConfig({ compare }),
    OpenSearchServerlessSecurityPolicy({ compare }),
    OpenSearchServerlessVpcEndpoint({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
