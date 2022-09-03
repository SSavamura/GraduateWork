import { Scenes } from "telegraf";
import { USERS_SCENE_KEYBOARD } from "../markup/keyboards";
import BotContext from "../libs/ibotcontext";

import {
	USER_ADD_BUTTON,
	USER_REMOVE_BUTTON,
	BACK_BUTTON,
	USERS_BUTTON
} from "../markup/buttons";

const BaseScene = Scenes.BaseScene;
const scene = new BaseScene<BotContext>('USERS_SCENE')

scene.enter((ctx) => {

	var msg = `[ ${USERS_BUTTON} ]\n\n` +
	'Список пользователей:\n'

	ctx.owners.forEach((user) => {

		msg += `- ${user}\n`

	})

	ctx.reply(msg, USERS_SCENE_KEYBOARD)

	console.log(new Date(), ctx.from?.username, 'enter', ctx.scene.current?.id)

})

scene.hears(USER_ADD_BUTTON, (ctx) => {

	return ctx.scene.enter('USER_SCENE_ADD')

})

scene.hears(USER_REMOVE_BUTTON, (ctx) => {

	return ctx.scene.enter('USER_SCENE_REMOVE')

})

scene.hears(BACK_BUTTON, (ctx) => {

	return ctx.scene.enter('MAIN_SCENE')

})

scene.leave((ctx) => {

	// console.log(new Date(), ctx.from?.username, 'leave', ctx.scene.current?.id)

})


export default [scene]