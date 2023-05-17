const assert = require("assert");
const { pipe, tap, get, map, pick, assign, not } = require("rubico");
const {
  defaultsDeep,
  callProp,
  isDeepEqual,
  differenceWith,
  unless,
  isEmpty,
  filterOut,
} = require("rubico/x");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./MemoryDBCommon");

const defaultParameters = {
  memorydb_redis6: [
    {
      ParameterName: "acllog-max-len",
      ParameterValue: "128",
    },
    {
      ParameterName: "activedefrag",
      ParameterValue: "no",
    },
    {
      ParameterName: "active-defrag-cycle-max",
      ParameterValue: "75",
    },
    {
      ParameterName: "active-defrag-cycle-min",
      ParameterValue: "5",
    },
    {
      ParameterName: "active-defrag-ignore-bytes",
      ParameterValue: "104857600",
    },
    {
      ParameterName: "active-defrag-max-scan-fields",
      ParameterValue: "1000",
    },
    {
      ParameterName: "active-defrag-threshold-lower",
      ParameterValue: "10",
    },
    {
      ParameterName: "active-defrag-threshold-upper",
      ParameterValue: "100",
    },
    {
      ParameterName: "active-expire-effort",
      ParameterValue: "1",
    },
    {
      ParameterName: "activerehashing",
      ParameterValue: "yes",
    },
    {
      ParameterName: "client-output-buffer-limit-normal-hard-limit",
      ParameterValue: "0",
    },
    {
      ParameterName: "client-output-buffer-limit-normal-soft-limit",
      ParameterValue: "0",
    },
    {
      ParameterName: "client-output-buffer-limit-normal-soft-seconds",
      ParameterValue: "0",
    },
    {
      ParameterName: "client-output-buffer-limit-pubsub-hard-limit",
      ParameterValue: "33554432",
    },
    {
      ParameterName: "client-output-buffer-limit-pubsub-soft-limit",
      ParameterValue: "8388608",
    },
    {
      ParameterName: "client-output-buffer-limit-pubsub-soft-seconds",
      ParameterValue: "60",
    },
    {
      ParameterName: "hash-max-ziplist-entries",
      ParameterValue: "512",
    },
    {
      ParameterName: "hash-max-ziplist-value",
      ParameterValue: "64",
    },
    {
      ParameterName: "hll-sparse-max-bytes",
      ParameterValue: "3000",
    },
    {
      ParameterName: "lazyfree-lazy-eviction",
      ParameterValue: "no",
    },
    {
      ParameterName: "lazyfree-lazy-expire",
      ParameterValue: "no",
    },
    {
      ParameterName: "lazyfree-lazy-server-del",
      ParameterValue: "no",
    },
    {
      ParameterName: "lazyfree-lazy-user-del",
      ParameterValue: "no",
    },
    {
      ParameterName: "lfu-decay-time",
      ParameterValue: "1",
    },
    {
      ParameterName: "lfu-log-factor",
      ParameterValue: "10",
    },
    {
      ParameterName: "list-compress-depth",
      ParameterValue: "0",
    },
    {
      ParameterName: "maxmemory-policy",
      ParameterValue: "noeviction",
    },
    {
      ParameterName: "maxmemory-samples",
      ParameterValue: "3",
    },
    {
      ParameterName: "notify-keyspace-events",
    },
    {
      ParameterName: "set-max-intset-entries",
      ParameterValue: "512",
    },
    {
      ParameterName: "slowlog-log-slower-than",
      ParameterValue: "10000",
    },
    {
      ParameterName: "slowlog-max-len",
      ParameterValue: "128",
    },
    {
      ParameterName: "stream-node-max-bytes",
      ParameterValue: "4096",
    },
    {
      ParameterName: "stream-node-max-entries",
      ParameterValue: "100",
    },
    {
      ParameterName: "tcp-keepalive",
      ParameterValue: "300",
    },
    {
      ParameterName: "timeout",
      ParameterValue: "0",
    },
    {
      ParameterName: "tracking-table-max-keys",
      ParameterValue: "1000000",
    },
    {
      ParameterName: "zset-max-ziplist-entries",
      ParameterValue: "128",
    },
    {
      ParameterName: "zset-max-ziplist-value",
      ParameterValue: "64",
    },
  ],
  memorydb_redis7: [
    {
      ParameterName: "acllog-max-len",
      ParameterValue: "128",
    },
    {
      ParameterName: "active-defrag-cycle-max",
      ParameterValue: "75",
    },
    {
      ParameterName: "active-defrag-cycle-min",
      ParameterValue: "5",
    },
    {
      ParameterName: "active-defrag-ignore-bytes",
      ParameterValue: "104857600",
    },
    {
      ParameterName: "active-defrag-max-scan-fields",
      ParameterValue: "1000",
    },
    {
      ParameterName: "active-defrag-threshold-lower",
      ParameterValue: "10",
    },
    {
      ParameterName: "active-defrag-threshold-upper",
      ParameterValue: "100",
    },
    {
      ParameterName: "active-expire-effort",
      ParameterValue: "1",
    },
    {
      ParameterName: "client-output-buffer-limit-normal-hard-limit",
      ParameterValue: "0",
    },
    {
      ParameterName: "client-output-buffer-limit-normal-soft-limit",
      ParameterValue: "0",
    },
    {
      ParameterName: "client-output-buffer-limit-normal-soft-seconds",
      ParameterValue: "0",
    },
    {
      ParameterName: "client-output-buffer-limit-pubsub-hard-limit",
      ParameterValue: "33554432",
    },
    {
      ParameterName: "client-output-buffer-limit-pubsub-soft-limit",
      ParameterValue: "8388608",
    },
    {
      ParameterName: "client-output-buffer-limit-pubsub-soft-seconds",
      ParameterValue: "60",
    },
    {
      ParameterName: "hash-max-listpack-entries",
      ParameterValue: "512",
    },
    {
      ParameterName: "hash-max-listpack-value",
      ParameterValue: "64",
    },
    {
      ParameterName: "hll-sparse-max-bytes",
      ParameterValue: "3000",
    },
    {
      ParameterName: "latency-tracking",
      ParameterValue: "no",
    },
    {
      ParameterName: "lazyfree-lazy-eviction",
      ParameterValue: "no",
    },
    {
      ParameterName: "lazyfree-lazy-expire",
      ParameterValue: "no",
    },
    {
      ParameterName: "lazyfree-lazy-server-del",
      ParameterValue: "no",
    },
    {
      ParameterName: "lazyfree-lazy-user-del",
      ParameterValue: "no",
    },
    {
      ParameterName: "lfu-decay-time",
      ParameterValue: "1",
    },
    {
      ParameterName: "lfu-log-factor",
      ParameterValue: "10",
    },
    {
      ParameterName: "list-compress-depth",
      ParameterValue: "0",
    },
    {
      ParameterName: "maxmemory-policy",
      ParameterValue: "noeviction",
    },
    {
      ParameterName: "maxmemory-samples",
      ParameterValue: "3",
    },
    {
      ParameterName: "notify-keyspace-events",
    },
    {
      ParameterName: "set-max-intset-entries",
      ParameterValue: "512",
    },
    {
      ParameterName: "slowlog-log-slower-than",
      ParameterValue: "10000",
    },
    {
      ParameterName: "slowlog-max-len",
      ParameterValue: "128",
    },
    {
      ParameterName: "stream-node-max-bytes",
      ParameterValue: "4096",
    },
    {
      ParameterName: "stream-node-max-entries",
      ParameterValue: "100",
    },
    {
      ParameterName: "tcp-keepalive",
      ParameterValue: "300",
    },
    {
      ParameterName: "timeout",
      ParameterValue: "0",
    },
    {
      ParameterName: "tracking-table-max-keys",
      ParameterValue: "1000000",
    },
    {
      ParameterName: "zset-max-listpack-entries",
      ParameterValue: "128",
    },
    {
      ParameterName: "zset-max-listpack-value",
      ParameterValue: "64",
    },
  ],
};

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(({ ParameterGroupName }) => {
    assert(ParameterGroupName);
  }),
  pick(["ParameterGroupName"]),
]);

const toParameterGroupName = pipe([
  tap(({ Name }) => {
    assert(Name);
  }),
  ({ Name, ...other }) => ({ ParameterGroupName: Name, ...other }),
]);

const managedByOther = () =>
  pipe([
    get("ParameterGroupName"),
    tap((ParameterGroupName) => {
      assert(ParameterGroupName);
    }),
    callProp("startsWith", "default"),
  ]);

const buildArn = () =>
  pipe([
    get("ARN"),
    tap((ARN) => {
      assert(ARN);
    }),
  ]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    toParameterGroupName,
    assignTags({ buildArn: buildArn(config), endpoint }),
    assign({
      ParameterNameValues: ({ ParameterGroupName, Family }) =>
        pipe([
          tap(() => {
            assert(ParameterGroupName);
            assert(Family);
          }),
          () => ({ ParameterGroupName }),
          endpoint().describeParameters,
          get("Parameters"),
          map(({ Name, Value }) => ({
            ParameterName: Name,
            ParameterValue: Value,
          })),
          // Remove undefined
          map(pipe([JSON.stringify, JSON.parse])),
          (parameters) =>
            differenceWith(isDeepEqual, parameters)(defaultParameters[Family]),
        ])(),
    }),
  ]);

const findName = () =>
  pipe([
    get("ParameterGroupName"),
    tap((Name) => {
      assert(Name);
    }),
  ]);

exports.MemoryDBParameterGroup = ({}) => ({
  type: "ParameterGroup",
  package: "memorydb",
  client: "MemoryDB",
  inferName: findName,
  findName,
  findId: findName,
  managedByOther,
  cannotBeDeleted: managedByOther,
  omitProperties: ["ARN"],
  ignoreErrorCodes: ["ParameterGroupNotFoundFault"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeParameterGroups-property
  getById: {
    method: "describeParameterGroups",
    getField: "ParameterGroups",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#describeParameterGroups-property
  getList: {
    transformListPre: () =>
      pipe([
        filterOut(
          pipe([
            get("Name"),
            tap((Name) => {
              assert(Name);
            }),
            callProp("startsWith", "default"),
          ])
        ),
      ]),
    method: "describeParameterGroups",
    getParam: "ParameterGroups",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#createParameterGroup-property
  create: {
    method: "createParameterGroup",
    pickCreated: ({ payload }) =>
      pipe([get("ParameterGroup"), toParameterGroupName]),
    postCreate: ({ endpoint, payload }) =>
      pipe([
        tap((params) => {
          assert(payload);
          assert(endpoint);
        }),
        () => payload,
        unless(
          pipe([get("ParameterNameValues"), isEmpty]),
          pipe([endpoint().updateParameterGroup])
        ),
      ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#modifyParameterGroup-property
  update: {
    method: "updateParameterGroup",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#deleteParameterGroup-property
  destroy: {
    method: "deleteParameterGroup",
    pickId,
  },
  getByName: ({ getList, endpoint, getById }) =>
    pipe([
      ({ name }) => ({
        ParameterGroupName: name,
      }),
      getById({}),
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Tags: buildTags({
          name,
          config,
          namespace,
          UserTags: Tags,
        }),
      }),
    ])(),
});
