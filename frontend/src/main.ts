import './polyfills.ts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/';
/*
import 'autotrack';
import 'autotrack/lib/plugins/event-tracker';
import 'autotrack/lib/plugins/url-change-tracker';
*/
const tracking_id = process.env.ANALYTICS_ID || 'UA-110454771-1';
const tracking_script_src = process.env.NODE_ENV === 'production'
    ?   'https://www.google-analytics.com/analytics.js'
    :   'https://www.google-analytics.com/analytics_debug.js';
require('./analytics.js')(tracking_id, tracking_script_src, false);

if (environment.production) {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
