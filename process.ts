import child_process from 'child_process';
import events from 'events';
import readline from 'readline';
import validator from 'validator';

const spawn = child_process.spawn;

class Process extends events.EventEmitter {
	command: string;
	args: string[];
	constructor(command: string, args: string[]) {
		super();

		this.command = command;
		this.args = args;
	}

	trace(domainName: string) {
		if (!this.isValidDomainName(domainName)) {
			throw 'Invalid domain name or IP address';
		}

		this.args.push(domainName);

		const process = spawn(this.command, this.args);
		process.on('close', (code) => {
			this.emit('close', code);
		});

		this.emit('pid', process.pid);

		let isDestinationCaptured = false;
		if (process.pid) {
			readline
				.createInterface({
					input: process.stdout,
					terminal: false
				})
				.on('line', (line) => {
					if (!isDestinationCaptured) {
						const destination = this.parseDestination(line);
						if (destination !== null) {
							this.emit('destination', destination);

							isDestinationCaptured = true;
						}
					}

					const hop = this.parseHop(line);
					if (hop !== null) {
						this.emit('hop', hop);
					}
				});
		}
	}

	isValidDomainName(domainName: string) {
		return validator.isFQDN(domainName + '') || validator.isIP(domainName + '');
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	parseDestination(data: string) {}
	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	parseHop(hopData: string) {}
}
export default Process;
