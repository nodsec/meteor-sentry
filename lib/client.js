import {Meteor} from 'meteor/meteor';
import { Integrations } from "@sentry/tracing";
import { CaptureConsole, ReportingObserver } from '@sentry/integrations';
import * as Sentry from "@sentry/react";

const _settings = Meteor.settings && Meteor.settings.public && Meteor.settings.public['SENTRY'] ? Meteor.settings.public['SENTRY'] : null;

let _initialized = false;

if (_settings) {
    if (_settings.enabled && _settings.dsn) {
        // Prepare Sentry options
        let sentryOptions = {};
        
        sentryOptions.dsn = _settings.dsn;
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
    }
}