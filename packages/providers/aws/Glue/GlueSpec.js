const assert = require("assert");
const { map, pipe, get, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const { GlueClassifier } = require("./GlueClassifier");
const { GlueConnection } = require("./GlueConnection");
const { GlueCrawler } = require("./GlueCrawler");
const { GlueDatabase } = require("./GlueDatabase");
const { GlueDevEndpoint } = require("./GlueDevEndpoint");
const { GlueJob } = require("./GlueJob");
const { GluePartition } = require("./GluePartition");
const { GlueRegistry } = require("./GlueRegistry");
const { GlueSchema } = require("./GlueSchema");
const { GlueTable } = require("./GlueTable");
const { GlueTrigger } = require("./GlueTrigger");
const { GlueWorkflow } = require("./GlueWorkflow");

const GROUP = "Glue";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    GlueClassifier({ compare }),
    GlueConnection({ compare }),
    GlueCrawler({ compare }),
    GlueDatabase({ compare }),
    GlueDevEndpoint({ compare }),
    GlueJob({ compare }),
    GluePartition({ compare }),
    GlueRegistry({ compare }),
    GlueSchema({ compare }),
    GlueTable({ compare }),
    GlueTrigger({ compare }),
    GlueWorkflow({ compare }),
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
