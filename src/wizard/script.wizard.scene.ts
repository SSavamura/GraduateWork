import { Markup, Scenes, } from 'telegraf';
import { ABORT_CONTINUE_KEYBOARD, ABORT_KEYBOARD, ABORT_RUN_KEYBOARD } from '../markup/keyboards';

import { ABORT_BUTTON, CONTINUE_BUTTON, RUN_BUTTON } from '../markup/buttons';
import Script, { ScriptArray } from '../libs/script';
import { saveScript } from '../libs/util';
import BotContext from '../libs/ibotcontext';

const WizardScene = Scenes.WizardScene;

const scriptSceneAdd = new WizardScene<BotContext>(
	"SCRIPT_SCENE_ADD",
	...[
		(ctx: any) => {

			ctx.reply('Введите название скрипта', ABORT_KEYBOARD);
			ctx.wizard.state.script = {}
			return ctx.wizard.next();

		},
		async (ctx: any) => {

			var text: string = ctx.message['text'];

			if (text === ABORT_BUTTON) {
				await ctx.reply('Операция отмененена')
				return ctx.scene.enter('SCRIPT_SCENE')
			}

			if (text) {

				ctx.wizard.state.script.name = text
				ctx.reply('Введите сам скрипт')

				return ctx.wizard.next();

			}

		},
		async (ctx: any) => {

			var text: string = ctx.message['text'];

			if (text === ABORT_BUTTON) {
				await ctx.reply('Операция отмененена')
				return ctx.scene.enter('SCRIPT_SCENE')
			}

			if (text) {

				ctx.wizard.state.script.command = text
				ctx.reply('По желанию вы можете ввести описание скрипта', ABORT_CONTINUE_KEYBOARD)

				return ctx.wizard.next();

			}

		},
		async (ctx: any) => {

			var text: string = ctx.message['text'];

			if (text === ABORT_BUTTON) {

				await ctx.reply('Операция отмененена')

			} else if (text !== CONTINUE_BUTTON) {

				ctx.wizard.state.script.desk = text

			}

			var data = ctx.wizard.state.script

			if (ctx.scripts) {

				if (data.name in ctx.scripts) {

					await ctx.reply('Скрипт с таким именем уже существует!')
					await ctx.reply('Операция отмененена!')

				} else {

					ctx.scripts[data.name] = new Script(data.name, data.command, data.desk)
					if (saveScript(ctx.scripts)) {
						await ctx.reply(`Скрипт ${data.name} добавлен!`);
					}

				}

			}

			return ctx.scene.enter('SCRIPT_SCENE')
		}
	]
);

const scriptSceneRemove = new WizardScene(
	"SCRIPT_SCENE_REMOVE",
	...[
		(ctx: any) => {

			var scripts: ScriptArray = ctx.scripts
			var buttons: any[] = []

			// TODO: Сделать проверку на длинну списка

			Object.keys(scripts).forEach((key) => {
				buttons.push(Markup.button.callback(key, key));
			})

			var markup = Markup.inlineKeyboard(buttons, { columns: 2 }).resize();

			ctx.reply('Выберите скрипт который хотите удалить', ABORT_KEYBOARD)
				.then(function () {
					ctx.reply('Список скриптов:', markup);
				});

			return ctx.wizard.next();

		},
		async (ctx: any) => {

			const update = ctx.update['message'] || ctx.update['callback_query'];
			var scripts: ScriptArray = ctx.scripts

			if ('data' in update) {
				var choice = update.data;
			}

			if ('text' in update) {
				var text = update.text;
			}

			if (text === ABORT_BUTTON) {
				await ctx.reply('Операция отмененена')
				ctx.scene.enter('SCRIPT_SCENE')
			}

			if (choice) {

				delete scripts[choice];

				ctx.scripts = scripts

				if (saveScript(ctx.scripts)) {
					await ctx.reply(`Скрипт ${choice} удален!`);
					ctx.scene.enter('SCRIPT_SCENE')
				}
			}
		}
	]
);

const scriptSceneRun = new WizardScene(
	"SCRIPT_SCENE_RUN",
	...[
		(ctx: any) => {

			var scripts: ScriptArray = ctx.scripts
			var buttons: any[] = []

			// TODO: Сделать проверку на длинну списка

			Object.keys(scripts).forEach((key) => {
				buttons.push(Markup.button.callback(key, key));
			})

			var markup = Markup.inlineKeyboard(buttons, { columns: 1 }).resize();

			ctx.reply('Выберите скрипт который хотите выполнить', ABORT_KEYBOARD)
				.then(function () {
					ctx.reply('Список скриптов:', markup);
				});

			return ctx.wizard.next();

		},
		async (ctx: any) => {

			const update = ctx.update['message'] || ctx.update['callback_query'];
			var scripts: ScriptArray = ctx.scripts

			if ('data' in update) {
				var choice = update.data;
			}

			if ('text' in update) {
				var text = update.text;
			}

			if (text === ABORT_BUTTON) {
				await ctx.reply('Операция отмененена')
				ctx.scene.enter('SCRIPT_SCENE')
			}

			if (choice) {

				var script = scripts[choice]

				ctx.wizard.state.selecScript = script;

				let msg = `Вы уверенны, что хотите выполнить?\n\n` +
				`Название:\n${script.name}\n\n` +  
				`Описание:\n${script.desc || 'Отсутствует'}`

				ctx.reply(msg, ABORT_RUN_KEYBOARD);
				return ctx.wizard.next();
			}
		},
		async (ctx: any) => {

			const update = ctx.update['message'] || ctx.update['callback_query'];

			if ('text' in update) {
				var text = update.text;
			}

			if (text === ABORT_BUTTON) {
				await ctx.reply('Операция отмененена')
				ctx.scene.enter('SCRIPT_SCENE')
			}

			if (text === RUN_BUTTON) {

				var script : Script = ctx.wizard.state.selecScript

				if (script) {
					var status = await script.exec()

					if (status) {
						await ctx.reply('Скрипт выполнен!')
					} else {
						await ctx.reply('Ошибка при выполнении скрипта!')
					}

				}

				ctx.scene.enter('SCRIPT_SCENE')

			}
			
		}
	]
);

export default [scriptSceneAdd, scriptSceneRemove, scriptSceneRun]
