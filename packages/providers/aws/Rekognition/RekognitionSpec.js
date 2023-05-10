const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const { RekognitionCollection } = require("./RekognitionCollection");
const { RekognitionProject } = require("./RekognitionProject");
const { RekognitionStreamProcessor } = require("./RekognitionStreamProcessor");

const GROUP = "Rekognition";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    RekognitionCollection({ compare }),
    RekognitionProject({ compare }),
    RekognitionStreamProcessor({ compare }),
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
