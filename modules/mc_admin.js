const { spawn } = require('promisify-child-process')
var fs = require('fs');


const run = async () => {
	

	try {
		const ls = await spawn("ls", ["-la"]);
		console.log(ls.toString())
	} catch (e) {
		console.log(e.stderr.toString())
	}
}



const add_policy = async (data) => {
	console.log(data);

	//mc admin policy info myminio1 bucketview --insecure
	//mc admin policy list myminio1 --insecure
	var response = {
		'status' : 'error',
	}
	// let update = true;
	// if(data?.update !== true) {
	// 	update = false
	// }

	let update = (data?.update !== true) ? false : true;

	//console.log(update);
	
	try {

		if(!update) {
			console.log('check');
			let policies = await list_policy();

			var i = policies['data'].indexOf(data['name']);
			console.log(i);
			if(i >= 0) {
				response['message'] = 'Policy name already exist.'; 
				return response;
			}
		}

		let rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		console.log(rand)
		var file = '/tmp/'+rand+'.json';
		console.log(file);
		fs.writeFileSync(file, JSON.stringify(data['policy']));
		console.log("File written successfully\n");

		const { stdout, stderr } = await spawn("/root/minio-binaries/mc", ["admin", "policy", "add", "myminio1", data['name'], file, "--insecure"], {encoding: 'utf8'});
		//const { stdout, stderr } = await spawn("ls", ["-lh"], {encoding: 'utf8'});
		let out = stdout.toString();
		console.log(out);
		response['status'] = 'success'
		response['message'] = out

		

	} catch (e) {
		console.log('errr');
		console.log(e.message);
		console.log(e);
		response['message'] = 'Error in create policy.';
		response['msg'] = e.message
		response['stderr'] = e.stderr

		let rx=/mc: <ERROR> /;
		if(e.stderr.match(rx)) {
			let error = e.stderr.replace(rx, function(x) {
				return '';
			})
			response['message'] = error
		}

	}

	fs.unlink( file, (err)=>{
		console.log(err);
	});

	return response;


}

const list_policy = async () => {
	var response = {
		'status' : 'error',
	}
	try {
		const { stdout, stderr } = await spawn("/root/minio-binaries/mc", ["admin", "policy", "list", "myminio1", "--insecure"], {encoding: 'utf8'});
		let out = stdout.toString().split("\n")
		if(out.length > 0) {
			for (i = 0; i < out.length; i++) {
				out[i] = out[i].replace(/\s+/, function(v) {
					return '';
				})
				if(out[i]==='') {
					out.splice(i, 1);
				}
			}
		}
		response['status'] = 'success'
		response['data'] = out

		return response;
	} catch (e) {
		console.log('errr');
		console.log(e.message);
		console.log(e);
		response['data'] = [];
		response['message'] = 'Error in list policies.';
		return response;
	}

}

const get_policy = async (name) => {
	var response = {
		'status' : 'error',
	}
	try {
		const { stdout, stderr } = await spawn("/root/minio-binaries/mc", ["admin", "policy", "info", "myminio1", name, "--insecure"], {encoding: 'utf8'});
		let out = stdout.toString()

		response['status'] = 'success'
		response['data'] = JSON.parse(out)

		return response;
	} catch (e) {
		console.log('errr');
		console.log(e.message);
		console.log(e);
		response['data'] = [];
		response['message'] = 'Error in get policy.';
		return response;
	}
}

module.exports = {
	run,
	add_policy,
	list_policy,
	get_policy
};

//const { spawn } = require("child_process");

// const run = () => {
// 	const ls = spawn("ls", ["-la"]);

// 	ls.stdout.on("data", data => {
// 		console.log(`stdout: ${data}`);
// 	});

// 	ls.stderr.on("data", data => {
// 		console.log(`stderr: ${data}`);
// 	});

// 	ls.on('error', (error) => {
// 		console.log(`error: ${error.message}`);
// 	});

// 	ls.on("close", code => {
// 		console.log(`child process exited with code ${code}`);
// 	});
// }

//module.exports.run = run;
