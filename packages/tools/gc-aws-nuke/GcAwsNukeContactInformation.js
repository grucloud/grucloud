const assert = require("assert");
const { pipe, tap } = require("rubico");

const {
  awsExecCommand,
} = require("@grucloud/core/cli/providers/createProjectAws");

exports.getContactInformation = pipe([
  tap(({ profile }) => {
    assert(profile);
  }),
  ({ profile }) => `account get-contact-information --profile ${profile}`,
  awsExecCommand({
    textEnd: pipe([
      ({ textStart, result }) =>
        `${textStart}\nFull name: ${result.ContactInformation.FullName}`,
    ]),
  }),
]);
