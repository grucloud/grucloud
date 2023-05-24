const assert = require("assert");
const Koa = require("koa");
const Router = require("@koa/router");
const shortid = require("shortid");
const chance = require("chance")();
const Promise = require("bluebird");
const { koaBody } = require("koa-body");
const logger = require("./logger")({ prefix: "MockServer" });
const { map } = require("rubico");
const portDefault = 7089;

exports.portDefault = portDefault;

exports.MockServer = (config) => {
  const koa = new Koa();
  const { routes } = config;
  const port = config.port || portDefault;
  let httpHandle;
  koa.use(koaBody());

  koa.use(async (ctx, next) => {
    const start = new Date();
    logger.debug(`${ctx.method} ${ctx.url} begins`);
    //logger.debug(`${JSON.stringify(ctx.header, 4, null)}`);
    await next();
    const ms = new Date() - start;

    logger.debug(
      `${ctx.method} ${ctx.url} ends in ${ms}ms, code: ${ctx.status}`
    );
  });

  koa.use(async (ctx, next) => {
    await next();
    if (config.delay) {
      const delay = chance.integer(config.delay);
      logger.debug(`${ctx.method} ${ctx.url} delay ${delay}`);
      await Promise.delay(delay);
    }
  });

  const mapRoutes = new Map();
  routes.map((route) => mapRoutes.set(route, new Map()));

  map(({ route, objects }) => {
    const mapResources = mapRoutes.get(route);
    assert(mapResources, `mapResources: no route ${route}`);

    map((object) => {
      const id = shortid.generate();
      mapResources.set(id, { ...object, id });
    })(objects);
  })(config.seeds || []);

  const createRouter = ({ path }) => {
    logger.info(`createRouter ${path}`);
    return new Router()
      .get(`${path}`, (context) => {
        const mapResources = mapRoutes.get(path);
        context.body = [...mapResources.values()];
        logger.debug(`get ${path}, result: ${JSON.stringify(context.body)}`);
        context.status = 200;
        //  context.status = 500;
      })
      .get(path, `${path}/:id`, (context) => {
        const {
          params: { id },
        } = context;
        logger.debug(`get ${path}, id: ${id}`);

        const mapResources = mapRoutes.get(path);
        if (mapResources.has(id)) {
          context.body = {
            id,
            data: mapResources.get(id),
          };
          context.status = 200;
        } else {
          context.status = 404;
        }
      })
      .del(path, `${path}/:id`, (context, next) => {
        const {
          params: { id },
        } = context;
        const mapResources = mapRoutes.get(path);
        const data = mapResources.get(id);
        logger.debug(`delete path: ${path}, id: ${id}`);

        mapResources.delete(id);
        if (data) {
          context.body = {
            id,
            data,
          };
          context.status = 200;
        } else {
          context.status = 404;
        }
      })
      .post(`${path}`, (context) => {
        const { request } = context;
        const { body } = request;
        const mapResources = mapRoutes.get(path);
        const id = shortid.generate();
        logger.debug(`post path: ${path}, id: ${id}`);

        mapResources.set(id, { id, ...body });
        //TODO hook to transform input into created object
        context.body = { id, data: mapResources.get(id) };
        context.status = 200;
      });
  };

  routes.forEach((route) => koa.use(createRouter({ path: route }).routes()));

  const start = async () =>
    new Promise((resolve) => {
      httpHandle = koa.listen(port, () => {
        logger.info(`start on port ${port}`);
        resolve();
      });
    });

  const stop = async () => {
    if (!httpHandle) {
      return;
    }
    return new Promise((resolve) => {
      httpHandle.close(() => {
        resolve();
      });
    });
  };

  return {
    start,
    stop,
  };
};
