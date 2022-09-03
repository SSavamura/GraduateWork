import { Scenes, } from 'telegraf';
import ngrok from 'ngrok';

import { BACK_OFF_KEYBOARD, BACK_ON_KEYBOARD } from '../markup/keyboards';

import { BACK_BUTTON, OFF_BUTTON, ON_BUTTON, TUNNEL_BUTTON } from '../markup/buttons';

const WizardScene = Scenes.WizardScene;


const tunnelSceneToggle = new WizardScene(
	"TUNNEL_SCENE_TOGGLE",
	...[
		async (ctx: any) => {

			var tunnel = ctx.tunnel ? ctx.tunnel[0] : undefined

			let msg = `[ ${TUNNEL_BUTTON} ]\n\n` +
				`Статус RDP: ${tunnel ? '🟢' : '🔴'}\n` +
				`${tunnel ? 'Адресс туннеля:' : ''}`

			await ctx.reply(msg, tunnel ? BACK_OFF_KEYBOARD : BACK_ON_KEYBOARD)

			if (tunnel) {

				await ctx.reply(tunnel)

			}

			return ctx.wizard.next();

		},
		async (ctx: any) => {

			const update = ctx.update['message'];

			if ('text' in update) {
				var text = update.text;
			}

			if (text === ON_BUTTON && !ctx.tunnel[0]) {

				try {
					var url = await ngrok.connect({ proto: 'tcp', addr: 3389 })

					var tunnel = url.slice(6)
					if (tunnel) {

						ctx.tunnel[0] = tunnel
						await ctx.reply('Туннель открыт!\nАдрес туннеля:')
						await ctx.reply(tunnel)

						console.log(new Date(), ctx.from?.username, 'activate RDP')

					}
				} catch (error) {

					await ctx.reply('Ошибка при открытие тунеля!')

				}

				ctx.scene.enter('DEVICE_SCENE')
			}

			if (text === OFF_BUTTON && ctx.tunnel[0]) {

				await ngrok.disconnect()
				delete ctx.tunnel[0]
				await ctx.reply('Туннель закрыт!')

				console.log(new Date(), ctx.from?.username, 'deactivate RDP')

				ctx.scene.enter('DEVICE_SCENE')
			}

			if (text === BACK_BUTTON) {
				ctx.scene.enter('DEVICE_SCENE')
			}

		}
	]
);

export default [tunnelSceneToggle]