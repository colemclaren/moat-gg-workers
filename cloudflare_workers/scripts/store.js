import * as cookie from 'cookie'
import body from './../pages/store.html';

export var store = {
	pattern: /^https:\/\/staging\.moat\.gg\/store\/[0-9]{17}$/,
	handle: async function(request) {
		const user = cookie.parse(request.headers.get('Cookie') || '').forum_steam_id;

		return new Response(body.replace('/store', `/store/${user}`), {
			headers: new Headers({
				"Content-Type": "text/html; charset=UTF-8"
			})
		})
	}
};