import { Scenes } from "telegraf";
import { SCRIPT_SCENE_KEYBOARD } from "../markup/keyboards";
import BotContext from "../libs/ibotcontext";

import {
	BACK_BUTTON, 
	SCRIPT_ADD_BUTTON, 
	SCRIPT_BUTTON,
	SCRIPT_REMOVE_BUTTON,
	SCRIPT_RUN_BUTTON
} from '../markup/buttons';



const BaseScene = Scenes.BaseScene;
const scene = new BaseScene<BotContext>('SCRIPT_SCENE')

scene.enter((ctx) => {

	var msg = `[ ${SCRIPT_BUTTON} ]\n\n`
	

	if (ctx.scripts) {

		msg += 'Список скриптов:\n'

		Object.keys(ctx.scripts).forEach((key) => {
			msg += `- ${key}\n`
		})

	}

	ctx.reply(msg, SCRIPT_SCENE_KEYBOARD)

	console.log(new Date(), ctx.from?.username, 'enter', ctx.scene.current?.id)

})

scene.hears(SCRIPT_RUN_BUTTON, (ctx) => {

	return ctx.scene.enter('SCRIPT_SCENE_RUN')

})

scene.hears(SCRIPT_ADD_BUTTON, (ctx) => {

	return ctx.scene.enter('SCRIPT_SCENE_ADD')

})

scene.hears(SCRIPT_REMOVE_BUTTON, (ctx) => {

	return ctx.scene.enter('SCRIPT_SCENE_REMOVE')

})

scene.hears(BACK_BUTTON, (ctx) => {

	return ctx.scene.enter('DEVICE_SCENE')

})

scene.leave((ctx) => {

	console.log(new Date(), ctx.from?.username, 'leave', ctx.scene.current?.id)

})


export default [scene]