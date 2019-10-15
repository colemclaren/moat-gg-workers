require('dotenv').config();

const request = require('request');
const fs = require('fs');
const cmd = require('node-cmd');
const promise = require('bluebird');
const cloudflare = require("cloudflare-workers-toolkit");

async function updateServers() {
	request('https://moat.gg/api/servers/current').pipe(fs.createWriteStream('/var/www/node-programs/cloudflare_workers/data/servers.json'))
}

async function webpack() {
	const getAsync = promise.promisify(cmd.get);
	await getAsync('npm run build --prefix /var/www/node-programs/cloudflare_workers/');
}

async function upload() {
	/*const scriptData = await fs.readFileSync('/var/www/node-programs/cloudflare_workers/dist/main.js');
	const res = await cloudflare.workers.deploy({
		accountId: false,
		script: scriptData
	})

	console.log("done");
	console.log(res);

	const routes = await cloudflare.routes.getRoutes();
	console.log(routes);
	*/
	fs.readFile('/var/www/node-programs/cloudflare_workers/dist/main.js', (err, data) => {
		if(err) return;
		request({
				method: 'PUT',
				headers: {
					'X-Auth-Email': 'cole@moat.gg',
					'X-Auth-Key': '0be83833f5e1c439b890907eedd783b2a312e',
					'Content-Type': 'application/javascript',
				},
				url: 'https://api.cloudflare.com/client/v4/zones/9c03f3d21aa99b7fe236bb96e88ea811/workers/script',
				body: data,
				encoding: null
			},
			function (error, response, body) {
				if(error) {
					return console.error('upload failed:', error);
				}
				console.log('Upload successful!  Server responded with:', JSON.parse(body.toString()));
			});
	});
}

module.exports.buildNewWorker = async function buildNewWorker() {
	await updateServers();
	await webpack();
	await upload();
}
