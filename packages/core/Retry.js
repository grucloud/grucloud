const assert = require("assert");
const { of, iif, throwError } = require("rxjs");
const {
  pipe,
  tryCatch,
  switchCase,
  or,
  tap,
  not,
  eq,
  get,
  and,
} = require("rubico");
const { identity, isIn } = require("rubico/x");
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
const { convertError } = require("./Common");

const retryCall = async ({
  name = "",
  fn,
  isExpectedResult = identity,
  isExpectedException = () => false,
  shouldRetryOnException = ({ error, name }) => {
    logger.info(
      `shouldRetryOnException ${name}, error: ${JSON.stringify(
        convertError({ error })
      )}`
    );
    error.stack && logger.error(error.stack);
    return !error.stack;
  },
  config: {
    repeatCount = 0,
    repeatDelay = 1e3,
    retryCount = 12 * 10,
    retryDelay = 5e3,
  } = {},
}) => {
  // logger.debug(
  //   `retryCall ${name}, retryCount: ${retryCount}, retryDelay: ${retryDelay}, repeatCount: ${repeatCount}, repeatDelay ${repeatDelay}`
  // );
  return of({})
    .pipe(
      mergeMap(
        tryCatch(
          pipe([
            () => fn(),
            switchCase([
              isExpectedResult,
              pipe([
                tap((result) => {
                  //logger.info(`retryCall ${name}, expected result`);
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
                    message: `${name}: not expected result`,
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
                //logger.error(`${name} not expected exception, ${error.stack}`);
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
      catchError(
        pipe([
          switchCase([
            and([not(get("hasMaxCount")), eq(get("error.code"), 503)]),
            ({ error }) => of(error.result),
            ({ error }) => {
              return throwError(error);
            },
          ]),
        ])
      )
    )
    .toPromise();
};
exports.retryCall = retryCall;

const shouldRetryOnExceptionDefault = pipe([
  get("error.code"),
  isIn([
    "ECONNABORTED",
    "ECONNRESET",
    "ENOTFOUND",
    "ENETDOWN",
    "EHOSTUNREACH",
    "ERR_BAD_RESPONSE", //"maxContentLength size of -1 exceeded "
    "ERR_SOCKET_CONNECTION_TIMEOUT",
  ]),
]);

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
