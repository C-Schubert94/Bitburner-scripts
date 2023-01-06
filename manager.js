/** @param {NS} ns */

//returns array of servers dynamically
function dpList(ns, current = 'home', set = new Set()) {
	let connections = ns.scan(current)
	let connectedServers = connections.filter(connection => !set.has(connection))
	connectedServers.forEach(server => {
		set.add(server);
		return dpList(ns, server, set)
	})
	return Array.from(set.keys())
}



function threadCount(ns, hostname, scriptRam) {
	let threads = 0;
	let freeRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);

	threads = freeRam / scriptRam;
	return Math.floor(threads);
}

export async function main(ns) {
	let servers = dpList(ns);
	let target = 'joesguns';

	// if(ns.getHackingLevel() < 100){
	// 	target = 'joesguns';
	// } else {
	// 	target = 'phantasy';
	// }

	for (let server of servers) {
		await ns.scp(['weaken.js', 'grow.js', 'hack.js'], server, 'home')
	}

	while (true) {

		let target2 = 'joesguns';

		await ns.sleep(10)
		for (let server of servers) {
			if (ns.hasRootAccess(server)) {

				//checking to see if target needs changed
				if (ns.getHackingLevel() >= 100 && ns.fileExists('BruteSSH.exe', 'home') && ns.fileExists('FTPcrack.exe', 'home')) {
					target = 'phantasy';
				}

				//takes purchased servers and hackes joesguns instead
				if (server.includes('bot')) {
					if (ns.getServerSecurityLevel(target2) > ns.getServerMinSecurityLevel(target2)) {
						let availableThreads = threadCount(ns, server, 1.75)
						//weaken server if security > min security
						if (availableThreads >= 1) {
							await ns.exec('weaken.js', server, availableThreads, target2)

						}
					} else if (ns.getServerMoneyAvailable(target2) < ns.getServerMaxMoney(target2)) {
						let availableThreads = threadCount(ns, server, 1.75)
						//grow server if money < max money available
						if (availableThreads >= 1) {
							await ns.exec('grow.js', server, availableThreads, target2)
						}
					} else {
						let availableThreads = threadCount(ns, server, 1.7)
						//hack target
						if (availableThreads >= 1 && ns.getServerMoneyAvailable(target2) > (ns.getServerMaxMoney(target2) * .85)) {
							await ns.exec('hack.js', server, availableThreads, target2)
						}
					}
				}


				//utilize all available threads to the most urgent command
				if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
					let availableThreads = threadCount(ns, server, 1.75)
					//weaken server if security > min security
					if (availableThreads >= 1) {
						await ns.exec('weaken.js', server, availableThreads, target)

					}
				} else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
					let availableThreads = threadCount(ns, server, 1.75)
					//grow server if money < max money available
					if (availableThreads >= 1) {
						await ns.exec('grow.js', server, availableThreads, target)
					}
				} else {
					let availableThreads = threadCount(ns, server, 1.7)
					//hack target
					if (availableThreads >= 1 && ns.getServerMoneyAvailable(target) > (ns.getServerMaxMoney(target) * .85)) {
						await ns.exec('hack.js', server, availableThreads, target)
					}
				}

			} else {
				try {
					//tries to gain root access to the server
					ns.brutessh(server)
					ns.ftpcrack(server)
					ns.relaysmtp(server)
					ns.httpworm(server)
					ns.sqlinject(server)

				} catch { }
				try {
					ns.nuke(server)
				} catch { }
			}
		}
	}
}