/*global require*/
/*jslint nomen: true*/
'use strict';

var https = require('https'),
    http = require('http'),
    RateLimiter = require('./rateLimiter'),
    limiterPer10s,
    limiterPer10min,

    craftUrl = function (urlType, region, api, authKey) {
        return 'https://' + region + '.' + urlType + '/' + region + api + 'api_key=' + authKey;
    },
    craftObserverUrl = function(urlType, region, api, authKey) {
        return 'https://' + region + '.' + urlType + api +
            'api_key=' + authKey;
    },
    craftStaticUrl = function(urlType, region, api, authKey) {
        return 'https://' + 'global.' + urlType + '/' + region + api + 'api_key=' + authKey;
    },
    craftStatusUrl = function(urlType, api, region) {
        return 'http://' + urlType + api + region;
    },
    checkLimits = function(callback) {
        if(limiterPer10s === undefined || limiterPer10min === undefined){
            process.nextTick(callback);
            return;
        }

        limiterPer10s.schedule( function(){
            limiterPer10min.schedule(callback);
        });

    },

    getRequest = function (path, callback) {
        var jsonObj = '',
            protocol = https;
        checkLimits(function (err){

            if(err !== undefined){
                callback(err, null);
            }
            if(path.indexOf('http://') !== -1) {
                protocol = http;
            }
            protocol.get(path, function (response) {
                response.on('data', function (chunk) {
                    jsonObj += chunk;
                });

                response.on('error', function (error) {
                    callback(error, null);
                });

                response.on('end', function () {
                    try {
                        jsonObj = JSON.parse(jsonObj);
                    } catch (e) {
                        callback(response.statusCode);
                        return;
                    }

                    if (jsonObj.status && jsonObj.status.message !== 200) {
                        callback(jsonObj.status.status_code + ' ' + jsonObj.status.message, null);
                    } else {
                        callback(null, jsonObj);
                    }
                });
            });
        });
    },

    makeRequest = function (url, errmsg, key, callback) {
        if (!callback) {
            return;
        }
        getRequest(url, function (err, result) {
            if (err) {
                callback(new Error(errmsg + err));
            } else {
                if (key) {
                    callback(null, result[key]);
                } else {
                    callback(null, result);
                }
            }
        });
    },

    getValidSeasonParam = function (season) {
        return (season === null || season === 3 || season === 4);
    },

    getCallbackAndRegion = function (regionOrFunction, region, callback) {
        var regionAndFunction = {
            'region': region,
            'callback': callback
        };

        if (typeof (regionOrFunction) === 'function') {
            regionAndFunction.callback = regionOrFunction;
        } else if (typeof (regionOrFunction) === 'string') {
            regionAndFunction.region = regionOrFunction;
        }

        return regionAndFunction;
    },
    setRateLimit = function (limitPer10s, limitPer10min){
        if(limitPer10s === false || limitPer10s === undefined){
            limiterPer10min = undefined;
            limiterPer10s = undefined;
            return;
        }
        limiterPer10s = new RateLimiter(limitPer10s, 10 * 1000, false);
        limiterPer10min = new RateLimiter(limitPer10min, 10 * 60 * 1000, false);
    };

module.exports = {
    craftUrl: craftUrl,
    craftObserverUrl: craftObserverUrl,
    craftStatusUrl: craftStatusUrl,
    craftStaticUrl: craftStaticUrl,
    getRequest: getRequest,
    makeRequest: makeRequest,
    getValidSeasonParam: getValidSeasonParam,
    getCallbackAndRegion: getCallbackAndRegion,
    setRateLimit: setRateLimit
};
