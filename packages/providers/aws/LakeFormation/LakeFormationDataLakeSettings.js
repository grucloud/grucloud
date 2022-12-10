const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, callProp, identity } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  () => ({}),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    omitIfEmpty(["ExternalDataFilteringAllowList", "TrustedResourceOwners"]),
  ]);

const cannotBeDeleted = () => () => true;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html
exports.LakeFormationDataLakeSettings = () => ({
  type: "DataLakeSettings",
  package: "lakeformation",
  client: "LakeFormation",
  propertiesDefault: {
    AllowExternalDataFiltering: false,
    Parameters: {
      CROSS_ACCOUNT_VERSION: "3",
    },
  },
  omitProperties: [],
  cannotBeDeleted,
  inferName: ({}) => pipe([() => "default"]),
  findName: ({ lives, config }) => pipe([() => "default"]),
  findId: () => pipe([() => "default"]),
  // dependencies: {
  //   accountAdmins: { type: "Account", group: "Organisations", list: true },
  // },
  ignoreErrorCodes: ["EntityNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        DataLakeAdmins: pipe([
          get("DataLakeAdmins"),
          map(
            assign({
              DataLakePrincipalIdentifier: pipe([
                get("DataLakePrincipalIdentifier"),
                replaceAccountAndRegion({ lives, providerConfig }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#getDataLakeSettings-property
  getById: {
    method: "getDataLakeSettings",
    getField: "DataLakeSettings",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#listDataLakeSettingss-property
  getList: {
    method: "getDataLakeSettings",
    getParam: "DataLakeSettings",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#putDataLakeSettings-property
  update: {
    method: "putDataLakeSettings",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([
        () => ({ DataLakeSettings: payload }),
        tap((params) => {
          assert(true);
        }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/LakeFormation.html#deleteDataLakeSettings-property
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      tap((params) => {
        assert(true);
      }),
    ])(),
});
