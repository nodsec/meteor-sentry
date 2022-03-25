import * as Sentry from "@sentry/node";

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
}