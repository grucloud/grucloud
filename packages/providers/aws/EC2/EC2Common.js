const assert = require("assert");
const { map, tap, pipe, get, pick, assign, switchCase, eq } = require("rubico");
const {
  pluck,
  unless,
  isEmpty,
  first,
  when,
  append,
  identity,
  find,
} = require("rubico/x");
const { createEndpoint, compareAws } = require("../AwsCommon");

const createEC2 = createEndpoint("ec2", "EC2");
exports.createEC2 = createEC2;

const getTargetTags = pipe([get("TagSpecifications"), first, get("Tags")]);

exports.compareEC2 = compareAws({
  getTargetTags,
  omitTargetKey: "TagSpecifications",
});

exports.findDependenciesVpc = ({ live }) => ({
  type: "Vpc",
  group: "EC2",
  ids: [live.VpcId],
});

exports.findDependenciesSubnet = ({ live }) => ({
  type: "Subnet",
  group: "EC2",
  ids: pipe([() => live, get("Associations"), pluck("SubnetId")])(),
});

exports.imageDescriptionFromId =
  ({ config }) =>
  ({ ImageId }) =>
    pipe([
      tap(() => {
        assert(config);
        assert(ImageId);
      }),
      () => ({ ImageIds: [ImageId] }),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeImages-property
      createEC2(config)().describeImages,
      get("Images"),
      first,
      pick(["Description"]),
      tap((params) => {
        assert(true);
      }),
    ])();

exports.fetchImageIdFromDescription = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    unless(isEmpty, ({ Description }) =>
      pipe([
        tap(() => {
          assert(Description);
        }),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeImages-property
        () => ({
          Filters: [
            {
              Name: "description",
              Values: [Description],
            },
          ],
        }),
        createEC2(config)().describeImages,
        get("Images"),
        first,
        get("ImageId"),
        tap((ImageId) => {
          assert(ImageId, `no ImageId for description ${Description}`);
        }),
      ])()
    ),
  ]);

exports.assignUserDataToBase64 = when(
  get("UserData"),
  assign({
    UserData: ({ UserData }) =>
      Buffer.from(UserData, "utf-8").toString("base64"),
  })
);

exports.appendCidrSuffix = ({
  DestinationCidrBlock,
  DestinationIpv6CidrBlock,
}) =>
  pipe([
    switchCase([
      () => DestinationCidrBlock,
      append(`::${DestinationCidrBlock}`),
      () => DestinationIpv6CidrBlock,
      append(`::${DestinationIpv6CidrBlock}`),
      identity, // Vpc Endpoint
    ]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createTags-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([(Tags) => ({ Resources: [id], Tags }), endpoint().createTags]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#deleteTags-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      map((Key) => ({ Key })),
      (Tags) => ({ Resources: [id], Tags }),
      endpoint().deleteTags,
    ]);

exports.getLaunchTemplateIdFromTags = pipe([
  tap((live) => {
    assert(live);
  }),
  get("Tags"),
  find(eq(get("Key"), "aws:ec2launchtemplate:id")),
  get("Value"),
]);
