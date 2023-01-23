const assert = require("assert");
const { pipe, tap, get, pick, switchCase } = require("rubico");
const { prepend, isEmpty } = require("rubico/x");

const { buildTags } = require("../AwsCommon");
const { tagResource, untagResource } = require("./EC2Common");

const findId = () => get("NetworkInterfaceId");
const pickId = pick(["NetworkInterfaceId"]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getNetworkInterfaceEntries-property
const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap((params) => {
        assert(config);
        assert(live.NetworkInterfaceId);
      }),
      () => live,
      get("Attachment.InstanceId"),
      lives.getById({
        providerName: config.providerName,
        type: "Instance",
        group: "EC2",
      }),
      tap((params) => {
        assert(true);
      }),
      get("name"),
      switchCase([isEmpty, () => live.NetworkInterfaceId, prepend("eni::")]),
    ])();

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
exports.EC2NetworkInterface = ({ compare }) => ({
  type: "NetworkInterface",
  package: "ec2",
  client: "EC2",
  managedByOther: () => () => true,
  cannotBeDeleted: () => () => true,
  findName,
  findId,
  omitProperties: ["Attachment"],
  filterLive: () => pipe([pick(["Description"])]),
  dependencies: {
    instance: {
      type: "Instance",
      group: "EC2",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Attachment.InstanceId"),
          lives.getById({
            providerName: config.providerName,
            type: "Instance",
            group: "EC2",
          }),
          get("id"),
        ]),
    },
  },
  ignoreErrorCodes: ["InvalidNetworkInterfaceID.NotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInterfaces-property
  // getById: {
  //   pickId: pipe([({ PrefixListId }) => ({ PrefixListIds: [PrefixListId] })]),
  //   method: "describeNetworkInterfaces",
  //   getField: "PrefixLists",
  //   ignoreErrorCodes,
  //   decorate,
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeNetworkInterfaces-property
  getList: {
    method: "describeNetworkInterfaces",
    getParam: "NetworkInterfaces",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createNetworkInterface-property
  // create: {
  //   method: "createNetworkInterface",
  //   pickCreated: () => pipe([get("PrefixList")]),
  //   isInstanceUp: eq(get("State"), "create-complete"),
  //   isInstanceError: eq(get("State"), "create-failed"),
  //   getErrorMessage: get("StateMessage", "create-failed"),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteNetworkInterface-property
  destroy: {
    pickId,
    method: "deleteNetworkInterface",
  },
  tagger: () => ({ tagResource: tagResource, untagResource: untagResource }),
});
