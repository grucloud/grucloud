const assert = require("assert");
const { map, pipe, get, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const { GlueClassifier } = require("./GlueClassifier");
const { GlueCrawler } = require("./GlueCrawler");
const { GlueDatabase } = require("./GlueDatabase");
const { GlueJob } = require("./GlueJob");
const { GlueTable } = require("./GlueTable");

const GROUP = "Glue";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    GlueClassifier({ compare }),
    GlueCrawler({ compare }),
    GlueDatabase({ compare }),
    GlueJob({ compare }),
    GlueTable({ compare }),
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
