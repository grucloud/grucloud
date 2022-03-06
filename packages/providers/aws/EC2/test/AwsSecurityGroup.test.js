const assert = require("assert");
const { get, eq } = require("rubico");
const { size, isEmpty } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const {
  SecurityGroupRulesFixture,
  SecurityGroupRulesFixtureMerged,
} = require("./AwsSecurityGroupFixtures");
const { mergeSecurityGroupRules } = require("../AwsSecurityGroupRule");

describe("AwsSecurityGroup", async function () {
  before(async function () {});
  after(async () => {});

  it("merge security group rules", async function () {
    const merged = mergeSecurityGroupRules(SecurityGroupRulesFixture);
    assert.equal(size(merged), 2);
    const diff = detailedDiff(merged, SecurityGroupRulesFixtureMerged);
    assert(isEmpty(diff.added));
    assert(isEmpty(diff.deleted));
    assert(isEmpty(diff.updated));
  });
});
