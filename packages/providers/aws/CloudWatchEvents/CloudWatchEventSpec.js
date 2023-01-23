const assert = require("assert");
const { tap, pipe, map, omit, pick, get, assign, not } = require("rubico");
const { defaultsDeep, unless, callProp, when } = require("rubico/x");

const { createAwsService } = require("../AwsService");

const {
  compareAws,
  isOurMinion,
  replaceAccountAndRegion,
} = require("../AwsCommon");

const { CloudWatchEventConnection } = require("./CloudWatchEventConnection");
const { CloudWatchEventBus } = require("./CloudWatchEventBus");
const { CloudWatchEventRule } = require("./CloudWatchEventRule");
const {
  CloudWatchEventTarget,
  EventTargetDependencies,
} = require("./CloudWatchEventTarget");
const {
  CloudWatchEventApiDestination,
} = require("./CloudWatchEventApiDestination");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html
const GROUP = "CloudWatchEvents";
const compare = compareAws({});

module.exports = pipe([
  () => [
    createAwsService(CloudWatchEventApiDestination({ compare })),
    createAwsService(CloudWatchEventConnection({ compare })),
    {
      type: "EventBus",
      Client: CloudWatchEventBus,
      inferName: () => get("Name", "default"),
      omitProperties: ["Arn"],
      filterLive: () => pipe([pick(["Name"])]),
    },
    {
      type: "Rule",
      Client: CloudWatchEventRule,
      inferName: () => get("Name"),
      omitProperties: ["Arn", "CreatedBy", "EventBusName"],
      compare: compare({
        filterTarget: () => pipe([defaultsDeep({ EventBusName: "default" })]),
        filterLive: () => pipe([omit(["Arn", "CreatedBy"])]),
      }),
      filterLive: ({ lives, providerConfig }) =>
        pipe([
          when(
            get("EventPattern"),
            assign({
              EventPattern: pipe([
                get("EventPattern"),
                when(
                  get("account"),
                  assign({
                    account: pipe([
                      get("account"),
                      map(
                        replaceAccountAndRegion({
                          providerConfig,
                          lives,
                        })
                      ),
                    ]),
                  })
                ),
              ]),
            })
          ),
        ]),
      dependencies: {
        eventBus: {
          type: "EventBus",
          group: "CloudWatchEvents",
          excludeDefaultDependencies: true,
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("EventBusName"),
              lives.getByName({
                type: "EventBus",
                group: "CloudWatchEvents",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
        },
      },
    },
    {
      type: "Target",
      Client: CloudWatchEventTarget,
      inferName:
        ({ dependenciesSpec: { rule } }) =>
        ({ Id }) =>
          pipe([
            tap((params) => {
              assert(Id);
              assert(rule);
            }),
            () => `target::${rule}::${Id}`,
          ])(),
      //TODO check update
      omitProperties: ["EventBusName", "Rule", "RoleArn", "Arn"],
      filterLive: () =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          unless(
            pipe([get("Arn"), callProp("startsWith", "arn:aws:autoscaling")]),
            omit(["Arn"])
          ),
        ]),
      dependencies: {
        rule: {
          type: "Rule",
          group: "CloudWatchEvents",
          parent: true,
          dependencyId: ({ lives, config }) =>
            pipe([
              get("Rule"),
              lives.getByName({
                type: "Rule",
                group: "CloudWatchEvents",
                providerName: config.providerName,
              }),
              get("id"),
            ]),
        },
        role: {
          type: "Role",
          group: "IAM",
          dependencyId: ({ lives, config }) => get("RoleArn"),
        },
        //TODO https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchEvents.html#putTargets-property
        ...EventTargetDependencies,
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compare({}),
      isOurMinion,
    })
  ),
]);
