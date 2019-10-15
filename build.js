const request = require('request');
const fs = require('fs');
const cmd = require('node-cmd');
const promise = require('bluebird');
require('dotenv').config();

async function updateServers() {
	request('https://moat.gg/api/servers/current').pipe(fs.createWriteStream(`${process.cwd()}/data/servers.json`))
}

async function webpack() {
	const getAsync = promise.promisify(cmd.get);
	await getAsync(`npm run build --prefix ${process.cwd()}/`);
}

async function upload(check) {
	fs.readFile(`${process.cwd()}/dist/main.js`, (err, data) => {
		if(err) return;
		
		request({
				method: 'PUT',
				headers: {
					'X-Auth-Email': process.env.CLOUDFLARE_AUTH_EMAIL,
					'X-Auth-Key': process.env.CLOUDFLARE_AUTH_KEY,
					'Content-Type': 'application/javascript',
				},
				url: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/workers/script`,
				body: data,
				encoding: null
			},
			function (error, response, body) {
				if(error) {
					if (process.env.DISCORD_WEBHOOK_NOTIFY)
						request.post(process.env.DISCORD_WEBHOOK_NOTIFY).form({content: `Worker upload failed: ${error}`});

					return console.error('upload failed:', error);
				}

				if (JSON.parse(body.toString()).result.script == data) {
					if (check && process.env.DISCORD_WEBHOOK_NOTIFY)
						request.post(process.env.DISCORD_WEBHOOK_NOTIFY).form({content: `**Cloudflare Workers** script is up to date.`});
					
					console.log('Cloudflare Workers are up to date. ', JSON.parse(body.toString()));
				} else {	
					if (process.env.DISCORD_WEBHOOK_NOTIFY)
						request.post(process.env.DISCORD_WEBHOOK_NOTIFY).form({content: `Worker upload was successful, but the script wasn't updated on Cloudflare's edge.`});

					console.log('Worker upload was successful, but the script wasn\'t updated on Cloudflare\'s edge. ', JSON.parse(body.toString()));
				}
			});
	});
}

async function buildNewWorker(check = false) {
	await updateServers();
	await webpack();
	await upload(check);
}

buildNewWorker(true);
setInterval(function() {
	buildNewWorker();
}, 120 * 1000);