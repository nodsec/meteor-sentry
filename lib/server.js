import * as Sentry from "@sentry/node";

const SentryLogger = {};

let _initialized = false;

let postprocess = () => {};

function init(options = {}) {
    if(_initialized)
        return;

    if(typeof options.postprocess === 'function') {
        postprocess = options.postprocess;
    }

    // Initialize Sentry on server side
    const _settings = Meteor.settings['SENTRY'];
    if (_settings && _settings.enabled && _settings.dsn) {
        const sentryOptions = {};
        
        sentryOptions.dsn = _settings.dsn;
        sentryOptions.integrations = [new Sentry.Integrations.Http({ tracing: true })]
        sentryOptions.debug = !!_settings.debug;

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        if(_settings.tracesSampleRate) {
            sentryOptions.tracesSampleRate = _settings.tracesSampleRate;
        }

        Sentry.init(sentryOptions);

        // Sentry capture all Uncaught Exceptions
        process.on('uncaughtException', function(err) {
            Sentry.captureException(err);
        
            console.error(err);
        });

        if(sentryOptions.debug)
            console.log('Sentry initialized...');

        _initialized = true;
    }
}

function log(level) {
    /**
    @param {Error | string} - event that is being logged
    @param {object} - any extra params you want to pass
    @returns {string} - sentry event id.
    */
    return function(event, extra) {
        let ret;

        if(event instanceof Error) {
            ret = Sentry.captureException(event);
        } else {
            ret = Sentry.captureEvent({
                message: event,
                level,
                extra,
                tags: {
                    key: Meteor.isClient ? 'client' : 'server'
                }
            });
        }

        postprocess(level, event, extra);

        return ret;
    };
}

SentryLogger.init = init;
SentryLogger.fatal = log('fatal');
SentryLogger.error = log('error');
SentryLogger.warning = log('warning');
SentryLogger.log = log('log');
SentryLogger.info = log('info');
SentryLogger.debug = log('debug');
SentryLogger.critical = log('critical');
