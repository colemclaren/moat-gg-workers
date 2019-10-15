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
	} else if(request.url.match(/^https:\/\/moat\.gg\/api\/servers\/?$/)) { //https://moat.gg/api/servers/
		const servers = require('./data/servers.json');

		return new Response(JSON.stringify(servers), {
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
	} else if(request.url.match(/^https:\/\/discord\.moat\.gg\//)) {
		let endpoint = new URL(request.url).pathname;

		try {
			const postData = await request.text();
			const response = await fetch(`https://discordapp.com${endpoint}`, {
				method: request.method,
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': request.headers.get('Authorization') || ''
				}),
				body: postData
			});

			return response
		} catch (err) {
			const response = await fetch(`https://discordapp.com${endpoint}`, {
				method: request.method,
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': request.headers.get('Authorization') || ''
				})
			});

			return response
		}
	} else if(request.url.match(/^https:\/\/discordapp\.moat\.gg\//)) {
		let proxy = request.url.replace(/^https:\/\/discordapp\.moat\.gg\//, `https://discordapp.com/`);
		
		try {
			const postData = await request.text();
			const response = await fetch(proxy, {
				method: request.method,
				headers: new Headers({
					'Content-Type': request.headers.get('Content-Type') || 'application/json',
					'Authorization': request.headers.get('Authorization') || ''
				}),
				body: postData
			});

			return response
		} catch (err) {
			const response = await fetch(proxy, {
				method: request.method,
				headers: new Headers({
					'Content-Type': request.headers.get('Content-Type') || 'application/json',
					'Authorization': request.headers.get('Authorization') || ''
				})
			});

			return response
		}
	} else if(request.url.match(/^https:\/\/gmc\.moat\.gg\//)) {
		return new Response(JSON.stringify({content:'hi'}), {
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
	}
	return fetch(request);
}