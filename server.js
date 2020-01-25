// This is the main server for drewwadsworth.com
// make constant variable here root of the website
// maybe want different constant variable root of dev.drewwadsworth.com
// when we receive dev requests with url pathname = /client-dev-interface pass to client-dev-interface
// otherwise, when we receive dev requests, just serve dev UI
// redirect drewwadsworth.com/dev to dev.drewwadsworth.com
// redirect http://drewwadsworth.com and http://dev.drewwadsworth.com to https with 308: permanent redirect