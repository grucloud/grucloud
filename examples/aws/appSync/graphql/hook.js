const assert = require("assert");
const { pipe, tap, get, eq, fork } = require("rubico");
const { find, first } = require("rubico/x");
const Axios = require("axios");
const { retryCallOnError } = require("@grucloud/core/Retry");

const getGraphqlUrl = ({ provider }) =>
  pipe([
    () => ({ options: { types: ["AppSync::GraphqlApi"] } }),
    provider.listLives,
    get("results"),
    find(eq(get("groupType"), "AppSync::GraphqlApi")),
    get("resources"),
    first,
    get("live.uris.GRAPHQL"),
    tap((GRAPHQL) => {
      assert(GRAPHQL);
    }),
  ]);

const getApiKey = ({ provider }) =>
  pipe([
    () => ({ options: { types: ["AppSync::ApiKey"] } }),
    provider.listLives,
    get("results"),
    find(eq(get("groupType"), "AppSync::ApiKey")),
    get("resources"),
    first,
    get("id"),
    tap((apiKey) => {
      assert(apiKey);
    }),
  ]);

module.exports = ({ provider }) => {
  return {
    name: "GraphqlApi",
    onDeployed: {
      init: pipe([
        fork({
          graphqlUrl: getGraphqlUrl({ provider }),
          apiKey: getApiKey({ provider }),
        }),
        ({ graphqlUrl, apiKey }) => ({
          axios: Axios.create({
            timeout: 15e3,
            baseURL: graphqlUrl,
            headers: { "x-api-key": apiKey },
          }),
        }),
      ]),
      actions: [
        {
          name: "Mutation ",
          command: pipe([
            ({ axios }) =>
              retryCallOnError({
                name: `query MyQuery`,
                fn: () =>
                  axios.post("", {
                    query: `
                    mutation MyMutation ($id:ID!, $name:String!){
                      createNote(note: {completed: false, id: $id, name: $name}) {
                        completed
                        id
                        name
                      }
                    }
                    `,
                    variables: {
                      id: "123",
                      name: "my-note",
                    },
                  }),
                isExpectedResult: pipe([
                  tap(({ data }) => {
                    assert(!data.errors, `errros ${data.errors}`);
                  }),
                  eq(get("status"), 200),
                ]),
                config: { retryCount: 10, retryDelay: 5e3 },
              }),
          ]),
        },
        {
          name: "Query",
          command: pipe([
            ({ axios }) =>
              retryCallOnError({
                name: `query MyQuery`,
                fn: () =>
                  axios.post("", {
                    query: `
                    query MyQuery {
                      listNotes {
                        completed
                        id
                        name
                      }
                    }
                `,
                  }),
                isExpectedResult: pipe([
                  tap((params) => {
                    assert(true);
                  }),
                  eq(get("status"), 200),
                ]),
                config: { retryCount: 10, retryDelay: 5e3 },
              }),
          ]),
        },
      ],
    },
  };
};
