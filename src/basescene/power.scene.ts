import { Scenes, Markup } from "telegraf";
import { POWER_SCENE_KEYBOARD } from "../markup/keyboards";
import BotContext from "../libs/ibotcontext";

import {
	ABORT_BUTTON,
	BACK_BUTTON,
	DEFRAG_BUTTON,
	HIBERNATE_BUTTON,
	LOCK_WORKSTATION_BUTTON,
	POWER_BUTTON,
	REBOOT_BUTTON,
	SHUTDOWN_BUTTON,
	SLEEP_BUTTON
} from '../markup/buttons';

import { def_scripts as scripts } from "../libs/script";

const ERROR_MSG = 'Что-то пошло не так!'

const abort_markup = Markup.inlineKeyboard([
	Markup.button.callback(ABORT_BUTTON, ABORT_BUTTON)
])


const BaseScene = Scenes.BaseScene;
const scene = new BaseScene<BotContext>('POWER_SCENE')


scene.enter((ctx) => {

	var msg = `[ ${POWER_BUTTON} ]\n\n` +
	'Перед выключением или перезагрузкой убедитесь, что все программы закроются корректно.'

	ctx.reply(msg, POWER_SCENE_KEYBOARD)

	console.log(new Date(), ctx.from?.username, 'enter', ctx.scene.current?.id)

})

scene.hears(SHUTDOWN_BUTTON, (ctx) => {

	scripts.shutdown.exec().then((status) => {
		if (status) {
			ctx.reply('Устройство выключиться через минуту!', abort_markup)
		} else {
			ctx.reply(ERROR_MSG)
		}
	})

})

scene.hears(REBOOT_BUTTON, (ctx) => {

	scripts.reboot.exec().then((status) => {

		if (status) {
			ctx.reply('Устройство перезагрузится через минуту!', abort_markup)
		} else {
			ctx.reply(ERROR_MSG)
		}
		
	})

})

scene.hears(LOCK_WORKSTATION_BUTTON, (ctx) => {

	scripts.lock.exec().then((status) => {

		if (status) {
			ctx.reply('Устройство заблокировано!')
		} else {
			ctx.reply(ERROR_MSG)
		}

	})
	

})

scene.hears(HIBERNATE_BUTTON, async (ctx) => {
	
	ctx.reply('Устройство сейчас перейдёт в гибернацию!')
	var status = await scripts.hibernate.exec()
	if (!status) {
		ctx.reply(ERROR_MSG)
	}

})

scene.hears(SLEEP_BUTTON, async (ctx) => {

	ctx.reply('Устройство сейчас перейдёт в сон!')
	var status = await scripts.sleep.exec()
	if (!status) {
		ctx.reply(ERROR_MSG)
	}

})

scene.hears(DEFRAG_BUTTON, async (ctx) => {

	await ctx.reply('Устройство производит дефрагментацию дисков, подождите!')
	var status = await scripts.defrag.exec()

	if (status) {
		ctx.reply('Дефрагментация закончена!')
	} else {
		ctx.reply(ERROR_MSG)
	}

}) 

scene.action(ABORT_BUTTON, async (ctx) => {

	scripts.abort_shutdown.exec().then((status) => {
		if (status) {
			ctx.reply('Операция отменена!')
		} else {
			ctx.reply(ERROR_MSG)
		}
	})

}) 

scene.hears(BACK_BUTTON, (ctx) => {

	return ctx.scene.enter('DEVICE_SCENE')

})

scene.leave((ctx) => {

	// console.log(new Date(), ctx.from?.username, 'leave', ctx.scene.current?.id)

})


export default [scene]