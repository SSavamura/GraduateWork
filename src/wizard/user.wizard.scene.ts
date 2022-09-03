import { Markup, Scenes, } from 'telegraf';
import { ABORT_KEYBOARD } from '../markup/keyboards';
import { saveUsers } from '../libs/util';

import { ABORT_BUTTON } from '../markup/buttons';

const WizardScene = Scenes.WizardScene;

const userSceneAdd = new WizardScene(
	"USER_SCENE_ADD",
	...[
		(ctx: any) => {

			ctx.reply('Введите имя пользователя c @', ABORT_KEYBOARD);
			return ctx.wizard.next();

		},
		async (ctx: any) => {

			var entities = ctx.message['entities'];
			var text: string = ctx.message['text'];

			if (text === ABORT_BUTTON) {
				await ctx.reply('Операция отмененена')
				ctx.scene.enter('USERS_SCENE')
			}

			if (entities && 'type' in entities[0]) {

				if (entities[0].type === 'mention') {

					var mention = text.replace('@', '');

					if (ctx.owners.includes(mention)) {
						await ctx.reply(`Пользователь ${mention} уже владелец!`)
						ctx.scene.enter('USERS_SCENE')
					}

					ctx.owners.push(mention);

					if (saveUsers(ctx.owners)) {
						await ctx.reply(`Пользователь ${mention} добавлен как владелец!`);
						ctx.scene.enter('USERS_SCENE')
					}
				}
			}
			else {
				ctx.reply('Некорректное имя пользователя!');
			}
		}
	]
);

const userSceneRemove = new WizardScene(
	"USER_SCENE_REMOVE",
	...[
		(ctx: any) => {

			var owners: string[] = ctx.owners
			var buttons: any[] = []

			// TODO: Сделать проверку на длинну списка
			owners.forEach((val) => {
				buttons.push(Markup.button.callback(val, val));
			});

			var markup = Markup.inlineKeyboard(buttons, { columns: 2 }).resize();

			ctx.reply('Выберите пользователя которого хотите удалить', ABORT_KEYBOARD)
				.then(function () {
					ctx.reply('Список пользователей:', markup);
				});

			return ctx.wizard.next();

		},
		async (ctx: any) => {

			const update = ctx.update['message'] || ctx.update['callback_query'];
			var owners: string[] = ctx.owners;

			if ('data' in update) {
				var choice = update.data;
			}

			if ('text' in update) {
				var text = update.text;
			}

			if (text === ABORT_BUTTON) {
				await ctx.reply('Операция отмененена')
				ctx.scene.enter('USERS_SCENE')
			}

			if (choice) {

				ctx.owners = owners.filter(val => { return val !== choice });

				if (saveUsers(ctx.owners)) {
					await ctx.reply(`Пользователь ${choice} удален из владельцев!`);
					ctx.scene.enter('USERS_SCENE')
				}
			}
		}
	]
);


export default [userSceneAdd, userSceneRemove]
