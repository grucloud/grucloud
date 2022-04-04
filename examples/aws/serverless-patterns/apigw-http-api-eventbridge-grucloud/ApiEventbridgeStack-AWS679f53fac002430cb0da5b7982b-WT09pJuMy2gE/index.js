"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.forceSdkInstallation = exports.flatten = exports.PHYSICAL_RESOURCE_ID_REFERENCE = void 0;
/* eslint-disable no-console */
const child_process_1 = require("child_process");
/**
 * Serialized form of the physical resource id for use in the operation parameters
 */
exports.PHYSICAL_RESOURCE_ID_REFERENCE = 'PHYSICAL:RESOURCEID:';
/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
function flatten(object) {
    return Object.assign({}, ...function _flatten(child, path = []) {
        return [].concat(...Object.keys(child)
            .map(key => {
            const childKey = Buffer.isBuffer(child[key]) ? child[key].toString('utf8') : child[key];
            return typeof childKey === 'object' && childKey !== null
                ? _flatten(childKey, path.concat([key]))
                : ({ [path.concat([key]).join('.')]: childKey });
        }));
    }(object));
}
exports.flatten = flatten;
/**
 * Decodes encoded special values (physicalResourceId)
 */
function decodeSpecialValues(object, physicalResourceId) {
    return JSON.parse(JSON.stringify(object), (_k, v) => {
        switch (v) {
            case exports.PHYSICAL_RESOURCE_ID_REFERENCE:
                return physicalResourceId;
            default:
                return v;
        }
    });
}
/**
 * Filters the keys of an object.
 */
function filterKeys(object, pred) {
    return Object.entries(object)
        .reduce((acc, [k, v]) => pred(k)
        ? { ...acc, [k]: v }
        : acc, {});
}
let latestSdkInstalled = false;
function forceSdkInstallation() {
    latestSdkInstalled = false;
}
exports.forceSdkInstallation = forceSdkInstallation;
/**
 * Installs latest AWS SDK v2
 */
function installLatestSdk() {
    console.log('Installing latest AWS SDK v2');
    // Both HOME and --prefix are needed here because /tmp is the only writable location
    child_process_1.execSync('HOME=/tmp npm install aws-sdk@2 --production --no-package-lock --no-save --prefix /tmp');
    latestSdkInstalled = true;
}
/* eslint-disable @typescript-eslint/no-require-imports, import/no-extraneous-dependencies */
async function handler(event, context) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _l, _m, _o, _p;
    try {
        let AWS;
        if (!latestSdkInstalled && event.ResourceProperties.InstallLatestAwsSdk === 'true') {
            try {
                installLatestSdk();
                AWS = require('/tmp/node_modules/aws-sdk');
            }
            catch (e) {
                console.log(`Failed to install latest AWS SDK v2: ${e}`);
                AWS = require('aws-sdk'); // Fallback to pre-installed version
            }
        }
        else if (latestSdkInstalled) {
            AWS = require('/tmp/node_modules/aws-sdk');
        }
        else {
            AWS = require('aws-sdk');
        }
        console.log(JSON.stringify(event));
        console.log('AWS SDK VERSION: ' + AWS.VERSION);
        event.ResourceProperties.Create = decodeCall(event.ResourceProperties.Create);
        event.ResourceProperties.Update = decodeCall(event.ResourceProperties.Update);
        event.ResourceProperties.Delete = decodeCall(event.ResourceProperties.Delete);
        // Default physical resource id
        let physicalResourceId;
        switch (event.RequestType) {
            case 'Create':
                physicalResourceId = (_j = (_f = (_c = (_b = (_a = event.ResourceProperties.Create) === null || _a === void 0 ? void 0 : _a.physicalResourceId) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : (_e = (_d = event.ResourceProperties.Update) === null || _d === void 0 ? void 0 : _d.physicalResourceId) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : (_h = (_g = event.ResourceProperties.Delete) === null || _g === void 0 ? void 0 : _g.physicalResourceId) === null || _h === void 0 ? void 0 : _h.id) !== null && _j !== void 0 ? _j : event.LogicalResourceId;
                break;
            case 'Update':
            case 'Delete':
                physicalResourceId = (_o = (_m = (_l = event.ResourceProperties[event.RequestType]) === null || _l === void 0 ? void 0 : _l.physicalResourceId) === null || _m === void 0 ? void 0 : _m.id) !== null && _o !== void 0 ? _o : event.PhysicalResourceId;
                break;
        }
        let flatData = {};
        let data = {};
        const call = event.ResourceProperties[event.RequestType];
        if (call) {
            if (call.assumedRoleArn) {
                const timestamp = (new Date()).getTime();
                const params = {
                    RoleArn: call.assumedRoleArn,
                    RoleSessionName: `${physicalResourceId}-${timestamp}`,
                };
                AWS.config.credentials = new AWS.ChainableTemporaryCredentials({
                    params: params,
                });
            }
            const awsService = new AWS[call.service]({
                apiVersion: call.apiVersion,
                region: call.region,
            });
            try {
                const response = await awsService[call.action](call.parameters && decodeSpecialValues(call.parameters, physicalResourceId)).promise();
                flatData = {
                    apiVersion: awsService.config.apiVersion,
                    region: awsService.config.region,
                    ...flatten(response),
                };
                let outputPaths;
                if (call.outputPath) {
                    outputPaths = [call.outputPath];
                }
                else if (call.outputPaths) {
                    outputPaths = call.outputPaths;
                }
                if (outputPaths) {
                    data = filterKeys(flatData, startsWithOneOf(outputPaths));
                }
                else {
                    data = flatData;
                }
            }
            catch (e) {
                if (!call.ignoreErrorCodesMatching || !new RegExp(call.ignoreErrorCodesMatching).test(e.code)) {
                    throw e;
                }
            }
            if ((_p = call.physicalResourceId) === null || _p === void 0 ? void 0 : _p.responsePath) {
                physicalResourceId = flatData[call.physicalResourceId.responsePath];
            }
        }
        await respond('SUCCESS', 'OK', physicalResourceId, data);
    }
    catch (e) {
        console.log(e);
        await respond('FAILED', e.message || 'Internal Error', context.logStreamName, {});
    }
    function respond(responseStatus, reason, physicalResourceId, data) {
        const responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: reason,
            PhysicalResourceId: physicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            NoEcho: false,
            Data: data,
        });
        console.log('Responding', responseBody);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const parsedUrl = require('url').parse(event.ResponseURL);
        const requestOptions = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.path,
            method: 'PUT',
            headers: { 'content-type': '', 'content-length': responseBody.length },
        };
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const request = require('https').request(requestOptions, resolve);
                request.on('error', reject);
                request.write(responseBody);
                request.end();
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.handler = handler;
function decodeCall(call) {
    if (!call) {
        return undefined;
    }
    return JSON.parse(call);
}
function startsWithOneOf(searchStrings) {
    return function (string) {
        for (const searchString of searchStrings) {
            if (string.startsWith(searchString)) {
                return true;
            }
        }
        return false;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsaURBQXlDO0FBU3pDOztHQUVHO0FBQ1UsUUFBQSw4QkFBOEIsR0FBRyxzQkFBc0IsQ0FBQztBQUVyRTs7Ozs7R0FLRztBQUNILFNBQWdCLE9BQU8sQ0FBQyxNQUFjO0lBQ3BDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FDbEIsRUFBRSxFQUNGLEdBQUcsU0FBUyxRQUFRLENBQUMsS0FBVSxFQUFFLE9BQWlCLEVBQUU7UUFDbEQsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDbkMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1QsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hGLE9BQU8sT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJLFFBQVEsS0FBSyxJQUFJO2dCQUN0RCxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FDVixDQUFDO0FBQ0osQ0FBQztBQWJELDBCQWFDO0FBRUQ7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S0FBSztZQUNiLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxDQUFDLE1BQU0sRUFBRTtTQUN2RSxDQUFDO1FBRUYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxJQUFJO2dCQUNGLGlFQUFpRTtnQkFDakUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM1QixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDZjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQXpJRCwwQkF5SUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxJQUF3QjtJQUMxQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQUUsT0FBTyxTQUFTLENBQUM7S0FBRTtJQUNoQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLGFBQXVCO0lBQzlDLE9BQU8sVUFBUyxNQUFjO1FBQzVCLEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxFQUFFO1lBQ3hDLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDbkMsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbi8vIGltcG9ydCB0aGUgQVdTTGFtYmRhIHBhY2thZ2UgZXhwbGljaXRseSxcbi8vIHdoaWNoIGlzIGdsb2JhbGx5IGF2YWlsYWJsZSBpbiB0aGUgTGFtYmRhIHJ1bnRpbWUsXG4vLyBhcyBvdGhlcndpc2UgbGlua2luZyB0aGlzIHJlcG9zaXRvcnkgd2l0aCBsaW5rLWFsbC5zaFxuLy8gZmFpbHMgaW4gdGhlIENESyBhcHAgZXhlY3V0ZWQgd2l0aCB0cy1ub2RlXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLGltcG9ydC9uby11bnJlc29sdmVkICovXG5pbXBvcnQgKiBhcyBBV1NMYW1iZGEgZnJvbSAnYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBd3NTZGtDYWxsIH0gZnJvbSAnLi4vYXdzLWN1c3RvbS1yZXNvdXJjZSc7XG5cbi8qKlxuICogU2VyaWFsaXplZCBmb3JtIG9mIHRoZSBwaHlzaWNhbCByZXNvdXJjZSBpZCBmb3IgdXNlIGluIHRoZSBvcGVyYXRpb24gcGFyYW1ldGVyc1xuICovXG5leHBvcnQgY29uc3QgUEhZU0lDQUxfUkVTT1VSQ0VfSURfUkVGRVJFTkNFID0gJ1BIWVNJQ0FMOlJFU09VUkNFSUQ6JztcblxuLyoqXG4gKiBGbGF0dGVucyBhIG5lc3RlZCBvYmplY3RcbiAqXG4gKiBAcGFyYW0gb2JqZWN0IHRoZSBvYmplY3QgdG8gYmUgZmxhdHRlbmVkXG4gKiBAcmV0dXJucyBhIGZsYXQgb2JqZWN0IHdpdGggcGF0aCBhcyBrZXlzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKG9iamVjdDogb2JqZWN0KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKFxuICAgIHt9LFxuICAgIC4uLmZ1bmN0aW9uIF9mbGF0dGVuKGNoaWxkOiBhbnksIHBhdGg6IHN0cmluZ1tdID0gW10pOiBhbnkge1xuICAgICAgcmV0dXJuIFtdLmNvbmNhdCguLi5PYmplY3Qua2V5cyhjaGlsZClcbiAgICAgICAgLm1hcChrZXkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNoaWxkS2V5ID0gQnVmZmVyLmlzQnVmZmVyKGNoaWxkW2tleV0pID8gY2hpbGRba2V5XS50b1N0cmluZygndXRmOCcpIDogY2hpbGRba2V5XTtcbiAgICAgICAgICByZXR1cm4gdHlwZW9mIGNoaWxkS2V5ID09PSAnb2JqZWN0JyAmJiBjaGlsZEtleSAhPT0gbnVsbFxuICAgICAgICAgICAgPyBfZmxhdHRlbihjaGlsZEtleSwgcGF0aC5jb25jYXQoW2tleV0pKVxuICAgICAgICAgICAgOiAoeyBbcGF0aC5jb25jYXQoW2tleV0pLmpvaW4oJy4nKV06IGNoaWxkS2V5IH0pO1xuICAgICAgICB9KSk7XG4gICAgfShvYmplY3QpLFxuICApO1xufVxuXG4vKipcbiAqIERlY29kZXMgZW5jb2RlZCBzcGVjaWFsIHZhbHVlcyAocGh5c2ljYWxSZXNvdXJjZUlkKVxuICovXG5mdW5jdGlvbiBkZWNvZGVTcGVjaWFsVmFsdWVzKG9iamVjdDogb2JqZWN0LCBwaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZykge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmplY3QpLCAoX2ssIHYpID0+IHtcbiAgICBzd2l0Y2ggKHYpIHtcbiAgICAgIGNhc2UgUEhZU0lDQUxfUkVTT1VSQ0VfSURfUkVGRVJFTkNFOlxuICAgICAgICByZXR1cm4gcGh5c2ljYWxSZXNvdXJjZUlkO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHRoZSBrZXlzIG9mIGFuIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyS2V5cyhvYmplY3Q6IG9iamVjdCwgcHJlZDogKGtleTogc3RyaW5nKSA9PiBib29sZWFuKSB7XG4gIHJldHVybiBPYmplY3QuZW50cmllcyhvYmplY3QpXG4gICAgLnJlZHVjZShcbiAgICAgIChhY2MsIFtrLCB2XSkgPT4gcHJlZChrKVxuICAgICAgICA/IHsgLi4uYWNjLCBba106IHYgfVxuICAgICAgICA6IGFjYyxcbiAgICAgIHt9LFxuICAgICk7XG59XG5cbmxldCBsYXRlc3RTZGtJbnN0YWxsZWQgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlU2RrSW5zdGFsbGF0aW9uKCkge1xuICBsYXRlc3RTZGtJbnN0YWxsZWQgPSBmYWxzZTtcbn1cblxuLyoqXG4gKiBJbnN0YWxscyBsYXRlc3QgQVdTIFNESyB2MlxuICovXG5mdW5jdGlvbiBpbnN0YWxsTGF0ZXN0U2RrKCk6IHZvaWQge1xuICBjb25zb2xlLmxvZygnSW5zdGFsbGluZyBsYXRlc3QgQVdTIFNESyB2MicpO1xuICAvLyBCb3RoIEhPTUUgYW5kIC0tcHJlZml4IGFyZSBuZWVkZWQgaGVyZSBiZWNhdXNlIC90bXAgaXMgdGhlIG9ubHkgd3JpdGFibGUgbG9jYXRpb25cbiAgZXhlY1N5bmMoJ0hPTUU9L3RtcCBucG0gaW5zdGFsbCBhd3Mtc2RrQDIgLS1wcm9kdWN0aW9uIC0tbm8tcGFja2FnZS1sb2NrIC0tbm8tc2F2ZSAtLXByZWZpeCAvdG1wJyk7XG4gIGxhdGVzdFNka0luc3RhbGxlZCA9IHRydWU7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSB7XG4gIHRyeSB7XG4gICAgbGV0IEFXUzogYW55O1xuICAgIGlmICghbGF0ZXN0U2RrSW5zdGFsbGVkICYmIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnN0YWxsTGF0ZXN0QXdzU2RrID09PSAndHJ1ZScpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGluc3RhbGxMYXRlc3RTZGsoKTtcbiAgICAgICAgQVdTID0gcmVxdWlyZSgnL3RtcC9ub2RlX21vZHVsZXMvYXdzLXNkaycpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgRmFpbGVkIHRvIGluc3RhbGwgbGF0ZXN0IEFXUyBTREsgdjI6ICR7ZX1gKTtcbiAgICAgICAgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpOyAvLyBGYWxsYmFjayB0byBwcmUtaW5zdGFsbGVkIHZlcnNpb25cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxhdGVzdFNka0luc3RhbGxlZCkge1xuICAgICAgQVdTID0gcmVxdWlyZSgnL3RtcC9ub2RlX21vZHVsZXMvYXdzLXNkaycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcbiAgICBjb25zb2xlLmxvZygnQVdTIFNESyBWRVJTSU9OOiAnICsgQVdTLlZFUlNJT04pO1xuXG4gICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNyZWF0ZSA9IGRlY29kZUNhbGwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNyZWF0ZSk7XG4gICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVwZGF0ZSA9IGRlY29kZUNhbGwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVwZGF0ZSk7XG4gICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZSA9IGRlY29kZUNhbGwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZSk7XG4gICAgLy8gRGVmYXVsdCBwaHlzaWNhbCByZXNvdXJjZSBpZFxuICAgIGxldCBwaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZztcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/PyBldmVudC5QaHlzaWNhbFJlc291cmNlSWQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGxldCBmbGF0RGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGxldCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgY29uc3QgY2FsbDogQXdzU2RrQ2FsbCB8IHVuZGVmaW5lZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1tldmVudC5SZXF1ZXN0VHlwZV07XG5cbiAgICBpZiAoY2FsbCkge1xuXG4gICAgICBpZiAoY2FsbC5hc3N1bWVkUm9sZUFybikge1xuXG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgIFJvbGVBcm46IGNhbGwuYXNzdW1lZFJvbGVBcm4sXG4gICAgICAgICAgUm9sZVNlc3Npb25OYW1lOiBgJHtwaHlzaWNhbFJlc291cmNlSWR9LSR7dGltZXN0YW1wfWAsXG4gICAgICAgIH07XG5cbiAgICAgICAgQVdTLmNvbmZpZy5jcmVkZW50aWFscyA9IG5ldyBBV1MuQ2hhaW5hYmxlVGVtcG9yYXJ5Q3JlZGVudGlhbHMoe1xuICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgICBjb25zdCBhd3NTZXJ2aWNlID0gbmV3IChBV1MgYXMgYW55KVtjYWxsLnNlcnZpY2VdKHtcbiAgICAgICAgYXBpVmVyc2lvbjogY2FsbC5hcGlWZXJzaW9uLFxuICAgICAgICByZWdpb246IGNhbGwucmVnaW9uLFxuICAgICAgfSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXdzU2VydmljZVtjYWxsLmFjdGlvbl0oXG4gICAgICAgICAgY2FsbC5wYXJhbWV0ZXJzICYmIGRlY29kZVNwZWNpYWxWYWx1ZXMoY2FsbC5wYXJhbWV0ZXJzLCBwaHlzaWNhbFJlc291cmNlSWQpKS5wcm9taXNlKCk7XG4gICAgICAgIGZsYXREYXRhID0ge1xuICAgICAgICAgIGFwaVZlcnNpb246IGF3c1NlcnZpY2UuY29uZmlnLmFwaVZlcnNpb24sIC8vIEZvciB0ZXN0IHB1cnBvc2VzOiBjaGVjayBpZiBhcGlWZXJzaW9uIHdhcyBjb3JyZWN0bHkgcGFzc2VkLlxuICAgICAgICAgIHJlZ2lvbjogYXdzU2VydmljZS5jb25maWcucmVnaW9uLCAvLyBGb3IgdGVzdCBwdXJwb3NlczogY2hlY2sgaWYgcmVnaW9uIHdhcyBjb3JyZWN0bHkgcGFzc2VkLlxuICAgICAgICAgIC4uLmZsYXR0ZW4ocmVzcG9uc2UpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBvdXRwdXRQYXRoczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChjYWxsLm91dHB1dFBhdGgpIHtcbiAgICAgICAgICBvdXRwdXRQYXRocyA9IFtjYWxsLm91dHB1dFBhdGhdO1xuICAgICAgICB9IGVsc2UgaWYgKGNhbGwub3V0cHV0UGF0aHMpIHtcbiAgICAgICAgICBvdXRwdXRQYXRocyA9IGNhbGwub3V0cHV0UGF0aHM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3V0cHV0UGF0aHMpIHtcbiAgICAgICAgICBkYXRhID0gZmlsdGVyS2V5cyhmbGF0RGF0YSwgc3RhcnRzV2l0aE9uZU9mKG91dHB1dFBhdGhzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IGZsYXREYXRhO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmICghY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcgfHwgIW5ldyBSZWdFeHAoY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcpLnRlc3QoZS5jb2RlKSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGwucGh5c2ljYWxSZXNvdXJjZUlkPy5yZXNwb25zZVBhdGgpIHtcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZmxhdERhdGFbY2FsbC5waHlzaWNhbFJlc291cmNlSWQucmVzcG9uc2VQYXRoXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKCdTVUNDRVNTJywgJ09LJywgcGh5c2ljYWxSZXNvdXJjZUlkLCBkYXRhKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGF3YWl0IHJlc3BvbmQoJ0ZBSUxFRCcsIGUubWVzc2FnZSB8fCAnSW50ZXJuYWwgRXJyb3InLCBjb250ZXh0LmxvZ1N0cmVhbU5hbWUsIHt9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc3BvbmQocmVzcG9uc2VTdGF0dXM6IHN0cmluZywgcmVhc29uOiBzdHJpbmcsIHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCByZXNwb25zZUJvZHkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBTdGF0dXM6IHJlc3BvbnNlU3RhdHVzLFxuICAgICAgUmVhc29uOiByZWFzb24sXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIFN0YWNrSWQ6IGV2ZW50LlN0YWNrSWQsXG4gICAgICBSZXF1ZXN0SWQ6IGV2ZW50LlJlcXVlc3RJZCxcbiAgICAgIExvZ2ljYWxSZXNvdXJjZUlkOiBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZCxcbiAgICAgIE5vRWNobzogZmFsc2UsXG4gICAgICBEYXRhOiBkYXRhLFxuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coJ1Jlc3BvbmRpbmcnLCByZXNwb25zZUJvZHkpO1xuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICBjb25zdCBwYXJzZWRVcmwgPSByZXF1aXJlKCd1cmwnKS5wYXJzZShldmVudC5SZXNwb25zZVVSTCk7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICBob3N0bmFtZTogcGFyc2VkVXJsLmhvc3RuYW1lLFxuICAgICAgcGF0aDogcGFyc2VkVXJsLnBhdGgsXG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgaGVhZGVyczogeyAnY29udGVudC10eXBlJzogJycsICdjb250ZW50LWxlbmd0aCc6IHJlc3BvbnNlQm9keS5sZW5ndGggfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdodHRwcycpLnJlcXVlc3QocmVxdWVzdE9wdGlvbnMsIHJlc29sdmUpO1xuICAgICAgICByZXF1ZXN0Lm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgICAgIHJlcXVlc3Qud3JpdGUocmVzcG9uc2VCb2R5KTtcbiAgICAgICAgcmVxdWVzdC5lbmQoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlY29kZUNhbGwoY2FsbDogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gIGlmICghY2FsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gIHJldHVybiBKU09OLnBhcnNlKGNhbGwpO1xufVxuXG5mdW5jdGlvbiBzdGFydHNXaXRoT25lT2Yoc2VhcmNoU3RyaW5nczogc3RyaW5nW10pOiAoc3RyaW5nOiBzdHJpbmcpID0+IGJvb2xlYW4ge1xuICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IHNlYXJjaFN0cmluZyBvZiBzZWFyY2hTdHJpbmdzKSB7XG4gICAgICBpZiAoc3RyaW5nLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuIl19