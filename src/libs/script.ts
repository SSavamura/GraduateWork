import { execSync } from "child_process";

export type ScriptArray = { [key: string] : Script }
export type ScriptArrayFromFile = { [key: string] : { name: string, command: string, desc?: string } }

export default class Script {

	readonly name: string;
	readonly command: string;
	readonly desc?: string

	constructor(name: string, command: string, desc?: string) {

		this.name = name;
		this.command = command;
		this.desc = desc;

	}

	async exec(): Promise<boolean> {

		try {
			execSync(this.command, { encoding: "utf8", stdio: "ignore" });
			// var status = execSync(`echo %errorlevel%`).toString().trim() // GET EXIT_CODE
			// console.log(this.name, Number.parseInt(status)); // EXIT_CODE
			return true;
		} catch (error) {
			return false;
		}

	}

}

const shutdown_script = new Script('SHUTDOWN', 'shutdown /s /t 60 /f');
const reboot_script = new Script('REBOOT', 'shutdown /r /t 60 /f');
const hibernate_script = new Script('HIBERNATE', 'shutdown /h');
const sleep_script = new Script('SLEEP', 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0');
const lock_script = new Script('LOCK', 'rundll32.exe user32.dll,LockWorkStation')
const abort_shutdown_script = new Script('ABORT_SHUTDOWN', 'shutdown /a');
const defrag_script = new Script('DEFRAG', 'defrag /C') // Работает только из под админа !!!

export const def_scripts = {
	
	shutdown : shutdown_script,
	reboot : reboot_script,
	hibernate : hibernate_script,
	sleep : sleep_script,
	lock : lock_script,
	abort_shutdown : abort_shutdown_script,
	defrag: defrag_script

}