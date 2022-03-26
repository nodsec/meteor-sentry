# nodsec:sentry

This package is a wrapper for sentry library. It allows you to simply use latest Sentry SDK on both client and a server in your meteor application.

This package is MIT Licensed.

# Installation

```
meteor add nodsec:sentry
```

# Usage

The same interface can be used on a client and server.

## Configuration

Sentry package is possible configure in Meteor.settings

```
{
    "SENTRY": {
        "public" : {
            "enabled" : true,
            "dsn" : "https://..............ingest.sentry.io/1234567",
            "debug" : true,
            "tracesSampleRate" : 1
        },
        "enabled" : true,
        "dsn" : "https://..............ingest.sentry.io/1234568",
        "debug" : true,
        "tracesSampleRate" : 1
    }
}

```

## Initialization (client/server)

```
import SentryLogger from 'meteor/nodsec:sentry';

Logger.init();
```

## Logging events (client/server)

```
import SentryLogger from 'meteor/nodsec:sentry';

Logger.info('Something happened', {
    userId: getUserId()
});
```

Logger has methods for all Sentry severity levels, such as:

```
SentryLogger.error()
SentryLogger.fatal()
SentryLogger.warning()
SentryLogger.info()
SentryLogger.debug()
SentryLogger.critical()
```

each method has following signature:

`function ( event, extra )`

**Returns**: <code>string</code> - sentry event id.

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Error</code> \ <code>string</code> | event that is being logged |
| extra | <code>object</code> | any extra params you want to pass |

## Logging unhandled exceptions (client/server)

Any unhandled exceptions that happen on the client or server should be automatically logged to Sentry. Nothing to configure there.

## Postprocessing (client/server)

If you wish to postprocess an event somehow - for instance log it to the console, you can pass a custom function in initialization.

```
import SentryLogger from 'meteor/nodsec:sentry';

Logger.init({
    postprocess: function(level, event, extra) {
        console.log(`[${level}] - ${event}`, extra);
    }
});
```
