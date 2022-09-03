import { writeFileSync, readFileSync } from 'fs';
import Script, { ScriptArray, ScriptArrayFromFile } from './script';

const USER_FILE_PATH = `${__dirname}/../users.json`
const SCRIPT_FILE_PATH = `${__dirname}/../scripts.json`

export function timeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


export function getUsers(): string[] | undefined {

	var users: string[] | undefined

	try {

		var data = readFileSync(USER_FILE_PATH, 'utf-8')
		users = JSON.parse(data)

	} catch (error) {

		if (error['code'] === 'ENOENT') {
			console.error('File users.json not found!')
		}
		else if (error instanceof SyntaxError) {

		}
		else {
			throw error
		}

	}

	return users
}

export function saveUsers(users: string[]): boolean {

	const data = JSON.stringify(users)

	try {

		writeFileSync(USER_FILE_PATH, data, 'utf-8');
		return true

	} catch (error) {

		if (error['code'] === 'ENOENT') {
			console.error('File users.json not found!')
			return false
		}
		else {
			throw error
		}

	}
}

export function getScript(): ScriptArray | undefined {

	var scripts: ScriptArray | undefined

	try {

		var data_json = readFileSync(SCRIPT_FILE_PATH, 'utf-8')
		var data : ScriptArrayFromFile = JSON.parse(data_json)
		
		Object.keys(data).forEach((value) => {

			let script_data = data[value]

			data[value] = new Script(script_data.name, script_data.command, script_data.desc)

		})

		scripts = data as ScriptArray

	} catch (error) {

		if (error['code'] === 'ENOENT') {
			console.error('File scripts.json not found!')
		}
		else if (error instanceof SyntaxError) {

		}
		else {
			throw error
		}

	}

	return scripts
}

export function saveScript(scripts: ScriptArray): boolean {

	const data = JSON.stringify(scripts, undefined, 1)

	try {

		writeFileSync(SCRIPT_FILE_PATH, data, 'utf-8');
		return true

	} catch (error) {

		if (error['code'] === 'ENOENT') {
			console.error('File scripts.json not found!')
			return false
		}
		else {
			throw error
		}

	}
}