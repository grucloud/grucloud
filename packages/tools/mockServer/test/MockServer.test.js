const assert = require("assert");
const { MockServer } = require("../MockServer");
const Axios = require("axios");
const { map, pipe, tap, tryCatch } = require("rubico");

const { portDefault } = require("../MockServer");
assert(portDefault);

describe("MockServer", function () {
  const routes = ["/compute/", "/address/"];
  const mockServer = MockServer({ portDefault, routes });
  const axios = Axios.create({ baseURL: `http://localhost:${portDefault}` });

  before(async function () {
    await mockServer.stop();
    await mockServer.start();
  });

  after(async function () {
    await mockServer.stop();
  });
  it("get 404 ", async () => {
    await map(
      async (route) =>
        await tryCatch(
          async (id) => {
            await axios.get(`${route}/aaaaaaaaa`);
            assert(false);
          },
          (error) => {
            assert.equal(error.response.status, 404);
          }
        )()
    )(routes);
  });
  it("e2e", async () => {
    await map(async (route) =>
      pipe([
        // Create
        (route) => axios.post(route, {}),
        (result) => {
          assert.equal(result.status, 200);
          assert(result.data.id);
          return result.data.id;
        },
        (id) =>
          pipe([
            (id) => axios.get(`${route}/${id}`),
            (result) => {
              assert.equal(result.status, 200);
              assert(result.data.id);
            },
            // Get All
            () => axios.get(route),
            (result) => {
              assert.equal(result.status, 200);
              const { data } = result;
              assert(data);
              return data[0].id;
            },
            // Delete
            (id) => axios.delete(`${route}/${id}`),
            tap((result) => {
              assert.equal(result.status, 200);
            }),
            // Delete again
            () =>
              tryCatch(
                async (id) => {
                  await axios.delete(`${route}/${id}`);
                  assert(false);
                },
                (error) => {
                  assert.equal(error.response.status, 404);
                }
              )(id),
          ])(id),
      ])(route)
    )(routes);
  });
});
