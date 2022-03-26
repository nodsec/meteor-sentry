import { Meteor } from 'meteor/meteor';
import { Integrations } from "@sentry/tracing";
import { CaptureConsole, ReportingObserver } from '@sentry/integrations';
import * as Sentry from '@sentry/browser';
import { Meteor } from 'meteor/meteor';

let _initialized = false;

let postprocess = () => {};

function init(options = {}) {
    if(_initialized)
        return;


    if(typeof options.postprocess === 'function') {
        postprocess = options.postprocess;
    }

    const _settings = Meteor.settings && Meteor.settings.public && Meteor.settings.public['SENTRY'] ? Meteor.settings.public['SENTRY'] : null;
    
    if (_settings) {
        if (_settings.enabled && _settings.dsn) {
            // Prepare Sentry options
            let sentryOptions = {};
            
            sentryOptions.dsn = _settings.dsn;
            sentryOptions.debug = !!_settings.debug;
            sentryOptions.integrations = [new Integrations.BrowserTracing(), new CaptureConsole({
                levels: ['warn', 'error', 'debug', 'assert'] // an array of methods that should be captured, defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
            }), new ReportingObserver()];
            
            if (_settings.tracesSampleRate) {
                sentryOptions.tracesSampleRate = _settings.tracesSampleRate;
            }
    
            // Initialize Sentry
            if (!_initialized) {
                Sentry.init(sentryOptions);
            }
    
            // Sentry tracking users
            if(_settings.trackUsers) {
                Tracker.autorun(() => {
                    const user = Meteor.user();
    
                    if(user) {
                        Sentry.configureScope(scope => {
                            scope.setUser(user);
                        });
                    }
                });
            }
    
            if(sentryOptions.debug)
                console.log('Sentry initialized...');

            _initialized = true;
        }
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
