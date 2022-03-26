Package.describe({
  name: 'nodsec:sentry',
  version: '1.1.2',
  summary: 'A simple wrapper for sentry SDK. Allows to use sentry in both client and server in meteor apps.',
  git: 'https://github.com/nodsec/meteor-sentry',
  documentation: 'README.md'
});

Npm.depends({
  '@sentry/browser': '6.19.2',
  '@sentry/react': '6.19.2',
  '@sentry/node': '6.19.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.1');
  api.use('ecmascript');
  api.mainModule('lib/client.js', 'client');
  api.mainModule('lib/server.js', 'server');
  api.export('SentryLogger');
});
