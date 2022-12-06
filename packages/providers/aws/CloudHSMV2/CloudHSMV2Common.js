const assert = require("assert");
const { pipe, tap, assign, get, map } = require("rubico");
const { first, prepend, values } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceId",
  TagsKey: "TagList",
  UnTagsKey: "TagKeyList",
});

const liveToTags = ({ TagList, ...other }) => ({
  ...other,
  Tags: TagList,
});

const findVpcName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () => live,
      get("VpcId"),
      tap((id) => {
        assert(id);
      }),
      lives.getById({
        type: "Vpc",
        group: "EC2",
        providerName: config.providerName,
      }),
      get("name", live.VpcId),
      tap((name) => {
        assert(name);
      }),
    ])();

exports.decorateCluster = ({ endpoint, config, lives }) =>
  pipe([
    ({ SubnetMapping, ...other }) => ({
      ...other,
      SubnetIds: values(SubnetMapping),
    }),
    assign({
      ClusterName: pipe([findVpcName({ config, lives }), prepend("cluster::")]),
    }),
    liveToTags,
    assign({
      Hsms: ({ Hsms, ClusterName }) =>
        pipe([
          tap((params) => {
            assert(ClusterName);
          }),
          () => Hsms,
          map((hsm) => ({
            ...hsm,
            HsmName: `${ClusterName}::${hsm.AvailabilityZone}`,
          })),
        ])(),
    }),
    tap((params) => {
      assert(true);
    }),
  ]);
