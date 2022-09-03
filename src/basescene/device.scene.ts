import os from 'os';
import * as osExt from '../libs/os_extends';

import { Scenes } from "telegraf";
import { DEVICE_SCENE_KEYBOARD } from "../markup/keyboards";
import BotContext from "../libs/ibotcontext";

import {
	STATUS_BUTTON,
	SCRIPT_BUTTON,
	POWER_BUTTON,
	BACK_BUTTON,
	DEVICE_BUTTON,
	TUNNEL_BUTTON
} from '../markup/buttons';


const BaseScene = Scenes.BaseScene;
const scene = new BaseScene<BotContext>('DEVICE_SCENE')

scene.enter((ctx) => {

	var msg = `[ ${DEVICE_BUTTON} ]\n`

	ctx.reply(msg, DEVICE_SCENE_KEYBOARD);

	console.log(new Date(), ctx.from?.username, 'enter', ctx.scene.current?.id)

})

scene.hears(STATUS_BUTTON, async (ctx) => {

	var cpu_usage = Math.round(await osExt.getCpuUsage() * 100);
	var mem_usage = Math.round(osExt.getMemUsage());
	var mem_total = Math.round(osExt.totalmem());
	var tunnel = ctx.tunnel ? ctx.tunnel[0] : undefined

	var stats = `[ Статус устройства 🖥 ]\n\n` +
		`Устройство: ${os.hostname}\n\n` +
		`- Загрузка процессора : ${cpu_usage}%\n` +
		`- Загрузка памяти : ${mem_usage}/${mem_total}\n` +
		`- Статус RDP: ${tunnel ? '🟢' : '🔴'}\n\n` +
		'[ Статус дисков 💿 ]\n';

	osExt.harddrive().forEach((val) => {

		let serial_number = val.SerialNumber;
		let status = val.Status ? '✅' : '🆘';

		let harddrive_stats = `${serial_number} ${status}`;

		stats += '\n' + harddrive_stats;

	});

	ctx.reply(stats);

})

scene.hears(SCRIPT_BUTTON, (ctx) => {

	return ctx.scene.enter('SCRIPT_SCENE')

})

scene.hears(TUNNEL_BUTTON, (ctx) => {

	return ctx.scene.enter('TUNNEL_SCENE_TOGGLE')

})

scene.hears(POWER_BUTTON, (ctx) => {

	return ctx.scene.enter('POWER_SCENE')

})

scene.hears(BACK_BUTTON, (ctx) => {

	return ctx.scene.enter('MAIN_SCENE')

})

scene.leave((ctx) => {

	// console.log(new Date(), ctx.from?.username, 'leave', ctx.scene.current?.id)

})


export default [scene]