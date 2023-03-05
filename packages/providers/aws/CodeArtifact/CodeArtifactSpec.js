const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");
const { CodeArtifactDomain } = require("./CodeArtifactDomain");
const {
  CodeArtifactDomainPermissionsPolicy,
} = require("./CodeArtifactDomainPermissionsPolicy");
const { CodeArtifactRepository } = require("./CodeArtifactRepository");
const {
  CodeArtifactRepositoryPermissionsPolicy,
} = require("./CodeArtifactRepositoryPermissionsPolicy");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeArtifact.html

const GROUP = "CodeArtifact";

const tagsKey = "tags";

const compare = compareAws({
  tagsKey,
  key: "key",
});

module.exports = pipe([
  () => [
    //
    CodeArtifactDomain({ compare }),
    CodeArtifactDomainPermissionsPolicy({ compare }),
    CodeArtifactRepository({ compare }),
    CodeArtifactRepositoryPermissionsPolicy({ compare }),
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
