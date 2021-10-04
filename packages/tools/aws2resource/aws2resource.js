const assert = require("assert");
const path = require("path");
const {
  pipe,
  tap,
  get,
  tryCatch,
  switchCase,
  pick,
  map,
  assign,
} = require("rubico");
const { prepend, size, defaultsDeep } = require("rubico/x");
const fs = require("fs").promises;
const Promise = require("bluebird");

const {
  CloudFormationClient,
  ListTypesCommand,
  DescribeTypeCommand,
} = require("@aws-sdk/client-cloudformation");

const listTypes = ({ client, NextToken, previousResults = [], options }) =>
  pipe([
    tap((params) => {
      //console.log(`listTypes ${NextToken}, #results: ${size(previousResults)}`);
    }),
    () => ({
      Visibility: "PUBLIC",
      ProvisioningType: "FULLY_MUTABLE",
      NextToken,
      Filters: { TypeNamePrefix: options.TypeNamePrefix },
    }),
    (input) => new ListTypesCommand(input),
    (command) => client.send(command),
    tap(({ NextToken }) => {
      //console.log(`listTypes NextToken: ${NextToken}`);
    }),
    switchCase([
      get("NextToken"),
      pipe([
        ({ NextToken, TypeSummaries }) =>
          listTypes({
            client,
            previousResults: [...previousResults, ...TypeSummaries],
            NextToken,
            options,
          })(),
        tap((params) => {
          assert(true);
        }),
      ]),
      pipe([
        get("TypeSummaries"),
        prepend(previousResults),
        tap((results) => {
          console.log(`listTypes results: ${size(results)}`);
        }),
      ]),
    ]),
  ]);

const describeTypes = ({ client }) =>
  pipe([
    tap((params) => {
      console.log(`describeTypes`);
    }),
    map.pool(
      1,
      pipe([
        pick(["TypeName"]),
        defaultsDeep({ Type: "RESOURCE" }),
        tap((params) => {
          assert(true);
        }),
        (input) => new DescribeTypeCommand(input),
        (command) => client.send(command),
        tap((result) => {
          console.log(`describeTypes ${result.TypeName}`);
        }),
        pick(["TypeName", "Schema"]),
        assign({ Schema: pipe([get("Schema"), JSON.parse]) }),
        tap(() => Promise.delay(1e3)),
      ])
    ),
    tap((results) => {
      console.log(`describeTypes`);
      console.log(results);
    }),
  ]);

const writeFile =
  ({ fileName }) =>
  (content) =>
    pipe([
      tap((params) => {
        assert(content);
      }),
      () => path.resolve(fileName),
      tap((params) => {
        assert(true);
      }),
      (fileNameResolved) =>
        fs.writeFile(
          fileNameResolved,
          JSON.stringify({ resources: content }, null, 4)
        ),
      tap((params) => {
        assert(true);
      }),
    ])();

exports.main = (options) =>
  tryCatch(
    pipe([
      tap((params) => {
        assert(true);
        console.log("Options: ", options);
      }),
      () => new CloudFormationClient({}),
      (client) =>
        pipe([listTypes({ client, options }), describeTypes({ client })])(),
      tap((params) => {
        assert(true);
      }),
      writeFile({ fileName: options.fileName }),
    ]),
    (error) => {
      console.error(error);
      throw error;
    }
  )();
