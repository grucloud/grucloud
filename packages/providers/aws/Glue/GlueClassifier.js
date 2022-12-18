const assert = require("assert");
const { pipe, tap, get, pick, not, map } = require("rubico");
const { defaultsDeep, find, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const classiferNames = [
  "CsvClassifier",
  "GrokClassifier",
  "JsonClassifier",
  "XMLClassifier",
];

const getName = (live) =>
  pipe([
    () => classiferNames,
    map((path) => get(`${path}.Name`)(live)),
    find(not(isEmpty)),
    tap((params) => {
      assert(true);
    }),
  ])();

const pickId = pipe([
  getName,
  (Name) => ({ Name }),
  tap(({ Name }) => {
    assert(Name);
  }),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html
exports.GlueClassifier = () => ({
  type: "Classifier",
  package: "glue",
  client: "Glue",
  propertiesDefault: {},
  omitProperties: [
    "CsvClassifier.CreationTime",
    "CsvClassifier.LastUpdated",
    "CsvClassifier.Version",
    "GrokClassifier.CreationTime",
    "GrokClassifier.LastUpdated",
    "GrokClassifier.Version",
    "JsonClassifier.CreationTime",
    "JsonClassifier.LastUpdated",
    "JsonClassifier.Version",
    "XMLClassifier.CreationTime",
    "XMLClassifier.LastUpdated",
    "XMLClassifier.Version",
  ],
  inferName: () => pipe([getName]),
  findName: () =>
    pipe([
      getName,
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      getName,
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes: ["EntityNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getClassifier-property
  getById: {
    method: "getClassifier",
    getField: "Classifier",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getClassifiers-property
  getList: {
    method: "getClassifiers",
    getParam: "Classifiers",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#createClassifier-property
  create: {
    //filterPayload,
    method: "createClassifier",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#updateClassifier-property
  update: {
    method: "updateClassifier",
    filterParams: ({ payload, diff, live }) =>
      pipe([
        () => payload,
        //filterPayload,
        defaultsDeep({ Name: payload.name }),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#deleteClassifier-property
  destroy: {
    method: "deleteClassifier",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
