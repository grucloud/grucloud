const assert = require("assert");
const { of, iif, throwError } = require("rxjs");
const { pipe, tryCatch, switchCase, or, tap } = require("rubico");
const { identity } = require("rubico/x");
const {
  retryWhen,
  repeatWhen,
  mergeMap,
  concatMap,
  take,
  delay,
  catchError,
} = require("rxjs/operators");
const logger = require("./logger")({ prefix: "Retry" });
const { tos } = require("./tos");
const { convertError } = require("./Common");

const retryCall = async ({
  name = "",
  fn,
  isExpectedResult = identity,
  isExpectedException = () => false,
  shouldRetryOnException = ({ error, name }) => {
    logger.info(
      `shouldRetryOnException ${name}, error: ${tos(convertError({ error }))}`
    );
    error.stack && logger.error(error.stack);
    return !error.stack;
  },
  config: {
    repeatCount = 0,
    repeatDelay = 1e3,
    retryCount = 12 * 5,
    retryDelay = 5e3,
  } = {},
}) => {
  logger.debug(
    `retryCall ${name}, retryCount: ${retryCount}, retryDelay: ${retryDelay}, repeatCount: ${repeatCount} `
  );
  return of({})
    .pipe(
      mergeMap(
        tryCatch(
          pipe([
            tap(() => {
              logger.debug(`retryCall ${name} invoking`);
            }),
            () => fn(),
            switchCase([
              isExpectedResult,
              pipe([
                tap((result) => {
                  logger.info(`retryCall ${name}, expected result`);
                }),
                identity,
              ]),
              pipe([
                tap((result) => {
                  logger.info(`${name} not an expected result`);
                }),
                (result) => {
                  throw {
                    code: 503,
                    type: "retryCall",
                    message: "not expected result",
                    result,
                  };
                },
              ]),
            ]),
          ]),
          switchCase([
            isExpectedException,
            pipe([
              tap((error) => {
                logger.info(`${name} expected exception`);
              }),
              identity,
            ]),
            pipe([
              tap((error) => {
                logger.info(`${name} not an expected exception`);
              }),
              (error) => {
                throw error;
              },
            ]),
          ])
        )
      ),

      repeatWhen((result) =>
        result.pipe(delay(repeatDelay), take(repeatCount))
      ),
      retryWhen((errors) =>
        errors.pipe(
          concatMap((error, i) => {
            logger.info(`retryCall ${name}, attempt ${i}/${retryCount}`);
            const hasMaxCount = i >= retryCount;
            return iif(
              () =>
                hasMaxCount ||
                (!shouldRetryOnException({ error, name }) && error.code != 503),
              throwError({ hasMaxCount, error }),
              of(error).pipe(delay(retryDelay))
            );
          })
        )
      ),
      catchError(({ hasMaxCount, error }) => {
        if (!hasMaxCount && error?.code == 503) {
          return of(error.result);
        } else {
          return throwError(error);
        }
      })
    )
    .toPromise();
};
exports.retryCall = retryCall;

const shouldRetryOnExceptionDefault = ({ error }) =>
  ["ECONNABORTED", "ECONNRESET", "ENOTFOUND", "ENETDOWN"].includes(error.code);

exports.retryCallOnError = ({
  name,
  fn,
  config,
  isExpectedException = () => false,
  shouldRetryOnException = () => false,
  isExpectedResult = (result) => {
    assert(result.status, `no status in result`);
    logger.debug(`${name} status: ${result.status}`);
    return [200, 201, 202, 204].includes(result.status);
  },
}) =>
  retryCall({
    name,
    fn,
    shouldRetryOnException: or([
      shouldRetryOnException,
      shouldRetryOnExceptionDefault,
    ]),
    isExpectedResult,
    isExpectedException,
    config,
  });
