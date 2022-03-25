import * as Sentry from "@sentry/node";

// Initialize Sentry on server side
const _settings = Meteor.settings['SENTRY'];
if (_settings && _settings.enabled && _settings.dsn) {
    const options = {};
    
    options.dsn = _settings.dsn;
    options.integrations = [new Sentry.Integrations.Http({ tracing: true })]
    options.debug = !!_settings.debug;

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    if(_settings.tracesSampleRate) {
        options.tracesSampleRate = _settings.tracesSampleRate;
    }

    Sentry.init(options);

    // Sentry capture all Uncaught Exceptions
    process.on('uncaughtException', function(err) {
        Sentry.captureException(err);
    
        console.error(err);
    });
}