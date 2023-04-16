const assert = require("assert");
const { map, pipe, tap, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const { KendraDataSource } = require("./KendraDataSource");
const { KendraExperience } = require("./KendraExperience");
const { KendraFaq } = require("./KendraFaq");
const {
  KendraQuerySuggestionsBlockList,
} = require("./KendraQuerySuggestionsBlockList");
const { KendraIndex } = require("./KendraIndex");
const { KendraThesaurus } = require("./KendraThesaurus");

const GROUP = "Kendra";

const tagsKey = "Tags";

const compare = compareAws({ tagsKey });

module.exports = pipe([
  () => [
    KendraDataSource({ compare }),
    KendraExperience({ compare }),
    KendraFaq({ compare }),
    KendraIndex({ compare }),
    KendraQuerySuggestionsBlockList({ compare }),
    KendraThesaurus({ compare }),
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
