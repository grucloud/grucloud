const assert = require("assert");
const { pipe, tap, get, eq, fork, or } = require("rubico");
const { find, first } = require("rubico/x");
const Axios = require("axios");
const { retryCallOnError } = require("@grucloud/core/Retry");

const getGraphqlApi = ({ provider }) =>
  pipe([
    () => ({ options: { types: ["AppSync::GraphqlApi"] } }),
    provider.listLives,
    get("results"),
    find(eq(get("groupType"), "AppSync::GraphqlApi")),
    get("resources"),
    first,
    get("live"),
  ])();

module.exports = ({ provider }) => {
  return {
    name: "GraphqlApi",
    onDeployed: {
      init: pipe([
        () => ({ provider }),
        getGraphqlApi,
        tap((params) => {
          assert(true);
        }),
        fork({
          graphqlUrl: get("uris.GRAPHQL"),
          apiKey: pipe([get("apiKeys"), first, get("id")]),
        }),
        tap(({ graphqlUrl, apiKey }) => {
          assert(graphqlUrl);
          assert(apiKey);
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
                shouldRetryOnException: or([
                  eq(get("error.code"), "ENOTFOUND"),
                ]),
                isExpectedResult: pipe([
                  tap(({ data }) => {
                    assert(
                      !data.errors,
                      `error ${JSON.stringify(data.errors, null, 4)}`
                    );
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
                shouldRetryOnException: or([
                  eq(get("error.code"), "ENOTFOUND"),
                ]),
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
