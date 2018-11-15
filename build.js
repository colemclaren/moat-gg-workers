const request = require('request');
const fs = require('fs');
const cmd = require('node-cmd');
const promise = require('bluebird');

async function updateServers() {
	request('https://moat.gg/api/servers/current').pipe(fs.createWriteStream('./data/servers.json'))
}

async function webpack() {
	const getAsync = promise.promisify(cmd.get);
	await getAsync('npm run build');
}

async function upload() {
	fs.readFile('./dist/main.js', (err, data) => {
		if(err) return;
		request({
				method: 'PUT',
				headers: {
					'X-Auth-Email': 'superdive101@gmail.com',
					'X-Auth-Key': '8c7e1a85ecf3b2cbc649e7cc8b357a5deab0c',
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

async function buildNewWorker() {
	await updateServers();
	await webpack();
	await upload();
}
buildNewWorker();
setInterval(function() {
	buildNewWorker();
}, 60 * 1000);