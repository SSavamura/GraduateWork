import os from 'os'
import si from 'systeminformation'
import { execSync } from 'child_process';
import { timeout } from './util'


type CpuInfo = {
	'idle': number
	'total': number
}

type DiskInfo = {
	'Model': string,
	'SerialNumber': string,
	'Status': boolean
}

export function getCPUInfo(): CpuInfo {
	var cpus = os.cpus();

	var user = 0;
	var nice = 0;
	var sys = 0;
	var idle = 0;
	var irq = 0;
	var total = 0;

	for (var cpu in cpus) {

		user += cpus[cpu].times.user;
		nice += cpus[cpu].times.nice;
		sys += cpus[cpu].times.sys;
		irq += cpus[cpu].times.irq;
		idle += cpus[cpu].times.idle;
	}

	var total = user + nice + sys + idle + irq;

	return {
		'idle': idle,
		'total': total
	};
}

export async function getCpuUsage(free: boolean = true): Promise<number> {

	var statsStart = getCPUInfo();
	await timeout(500)
	var statsEnd = getCPUInfo()

	var idle = statsEnd.idle - statsStart.idle
	var total = statsEnd.total - statsStart.total

	var perc = idle / total

	if (free === true) {
		return (1 - perc);
	} else {
		return perc;
	}

}

// Работает только с админ правами
export async function getCpuTemp() {

	si.cpuTemperature((tmp) => {

		console.log(tmp);

	})

}

export function freemem(): number {

	return os.freemem() / (1024 * 1024)

}

export function totalmem(): number {

	return os.totalmem() / (1024 * 1024)

}

export function getMemUsage(): number {

	return totalmem() - freemem()

}

export function harddrive(): DiskInfo[] {

	var disks_info: DiskInfo[] = []

	var console_comand = 'wmic diskdrive get Model, SerialNumber, Status'

	var stdout = execSync(console_comand, { encoding: 'utf8' })

	var lines = stdout.split("\n").slice(1);

	var str_disk_info = lines[0].replace(/\s{2,}|\n+|\r+/g, '_');

	var disk_info = str_disk_info.split('_');

	disks_info.push({
		'Model': disk_info[0],
		'SerialNumber': disk_info[1],
		'Status': disk_info[2] === 'OK' ? true : false
	})

	return disks_info;

}

export function getDiskList(): string[] {

	var console_comand = 'wmic logicaldisk get caption'

	var stdout = execSync(console_comand, { encoding: 'utf8' })

	var disk_caption = stdout.trim()
	.split('\n')
	.slice(1)
	.map((val) => val.trim())

	return disk_caption;

}
