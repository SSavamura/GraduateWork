import { Scenes } from "telegraf";
import { MAIN_KEYBOARD } from "../markup/keyboards";
import BotContext from "../libs/ibotcontext";

import {
	DEVICE_BUTTON,
	USERS_BUTTON,
} from "../markup/buttons";

const BaseScene = Scenes.BaseScene;
const scene = new BaseScene<BotContext>('MAIN_SCENE')

scene.enter((ctx) => {

	const msg = '[ Главная 🏠 ]\n\n' +
		'Разделы: \n' +
		'[ Устройство 🖥️ ] - информцию об устройстве\n' +
		'[ Пользователи 🙍‍♂️ ] - информцию о пользователях\n'

	ctx.reply(msg, MAIN_KEYBOARD);

	console.log(new Date(), ctx.from?.username, 'enter', ctx.scene.current?.id);

})

scene.hears(DEVICE_BUTTON, async (ctx) => {

	return ctx.scene.enter('DEVICE_SCENE');

})

scene.hears(USERS_BUTTON, async (ctx) => {

	return ctx.scene.enter('USERS_SCENE');

})

scene.on('message', (ctx) => {

	ctx.reply('Команда не распознана 😔', MAIN_KEYBOARD);

})

scene.leave((ctx) => {

	// console.log(new Date(), ctx.from?.username, 'leave', ctx.scene.current?.id)

})

export default [scene]