Package.describe({
  name: 'communecter:account',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');

  api.use([
    'ecmascript',
    'ejson',
    'underscore',
    'accounts-base',
    'http',
    'check',
    'simple:json-routes@2.1.0',
    'simple:authenticate-user-by-token@1.0.1',
    'simple:rest-bearer-token-parser@1.0.1',
    'simple:rest-json-error-handler@1.0.1'
  ]);

  api.add_files('server/config.js', 'server');
  api.add_files('client/config.js', 'client');

});
