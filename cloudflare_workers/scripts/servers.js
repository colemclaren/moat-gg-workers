import cache from './data/servers.json';

export var servers = {
	pattern: /^https:\/\/moat\.gg\/api\/servers\/?$/,
	handle: async function(request) {
		const servers = cache;

		return new Response(JSON.stringify(servers), {
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
	}
};