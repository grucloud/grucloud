const assert = require("assert");
const { pipe, tap, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const { AwsCertificate } = require("./AwsCertificate");

const GROUP = "ACM";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    AwsCertificate({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
