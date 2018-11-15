const cookie = require('cookie');

addEventListener('fetch', event => {
	event.respondWith(handle(event.request));

});

async function handle(request) {
	if(request.url.match(/^https:\/\/staging\.moat\.gg\/store\/[0-9]{17}$/)) { //https://staging.moat.gg/store/765XX
		const store = require('./pages/store.html');
		const user = cookie.parse(request.headers.get('Cookie') || '').forum_steam_id;

		return new Response(store.replace('/store', `/store/${user}`), {
			headers: new Headers({
				"Content-Type": "text/html; charset=UTF-8"
			})
		})
	} else if(request.url.match(/^https:\/\/staging\.moat\.gg\/api\/servers\/?$/)) { //https://staging.moat.gg/api/servers/
		const servers = require('./data/servers.json');

		return new Response(JSON.stringify(servers), {
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
	}
	return fetch(request);
}
