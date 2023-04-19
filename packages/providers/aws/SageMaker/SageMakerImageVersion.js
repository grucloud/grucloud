const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, isIn, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const { ignoreErrorCodes, arnToId } = require("./SageMakerCommon");

const pickId = pipe([
  tap(({ ImageName, Alias, Version }) => {
    assert(ImageName);
  }),
  pick(["ImageName", "Alias", "Version"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html
exports.SageMakerImageVersion = () => ({
  type: "ImageVersion",
  package: "sagemaker",
  client: "SageMaker",
  propertiesDefault: {},
  omitProperties: [
    "ImageName",
    "ImageVersionArn",
    "ImageVersionStatus",
    "CreationTime",
    "FailureReason",
    "LastModifiedTime",
    "LastModifiedTime",
  ],
  inferName:
    ({ dependenciesSpec: { image } }) =>
    ({ Version }) =>
      pipe([
        tap((params) => {
          assert(image);
          assert(Version);
        }),
        () => `${image}::${Version}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ ImageName, Version }) =>
      pipe([
        tap((params) => {
          assert(ImageName);
          assert(Version);
        }),
        () => `${imaImageNamege}::${Version}`,
      ])(),
  findId: () =>
    pipe([
      get("ImageVersionArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    image: {
      type: "Image",
      group: "SageMaker",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("ImageName"),
          tap((ImageName) => {
            assert(ImageName);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#describeImageVersion-property
  getById: {
    method: "describeImageVersion",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#listImageVersions-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Image", group: "SageMaker" },
          pickKey: pipe([
            pick(["ImageName"]),
            tap(({ ImageName }) => {
              assert(ImageName);
            }),
          ]),
          method: "listImageVersions",
          getParam: "ImageVersions",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#createImageVersion-property
  create: {
    method: "createImageVersion",
    pickCreated: ({ payload }) => pipe([identity, arnToId("")]),
    isInstanceUp: pipe([get("ImageVersionStatus"), isIn(["CREATED"])]),
    isInstanceError: pipe([get("ImageVersionStatus"), isIn(["CREATE_FAILED"])]),
    getErrorMessage: pipe([get("FailureReason", "Failed")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#updateImageVersion-property
  update: {
    method: "updateImageVersion",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SageMaker.html#deleteImageVersion-property
  destroy: {
    method: "deleteImageVersion",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { image },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(image);
      }),
      () => otherProps,
      defaultsDeep({ ImageName: image.config.ImageName }),
    ])(),
});
