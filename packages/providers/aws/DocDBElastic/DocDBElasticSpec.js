const assert = require("assert");
const { map, pipe } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { DocDBElasticCluster } = require("./DocDBElasticCluster");

const GROUP = "DocDBElastic";

const tagsKey = "tags";
const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    //
    DocDBElasticCluster({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({ group: GROUP, compare: compare({}), tagsKey }),
    ])
  ),
]);
