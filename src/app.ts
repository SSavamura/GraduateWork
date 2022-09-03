import IConfig from './libs/iconfig';
import _config from './config.json';
const config : IConfig = _config;

// Telegramm imports

import { Telegraf, Scenes, session } from 'telegraf';
// import NodeClam from 'clamscan';
// import chokidar from 'chokidar';
import ngrok from 'ngrok';

import { getScript, getUsers, saveScript, saveUsers } from './libs/util';
import BotContext from './libs/ibotcontext';
import { MAIN_KEYBOARD } from './markup/keyboards';

const Stage = Scenes.Stage;

// ---------------------------------------------------------


//#region Telegram:init

const stages = [
	...require('./basescene/main.scene').default,
	...require('./basescene/user.scene').default,
	...require('./basescene/device.scene').default,
	...require('./basescene/power.scene').default,
	...require('./basescene/script.scene').default,
	...require('./wizard/user.wizard.scene').default,
	...require('./wizard/script.wizard.scene').default,
	...require('./wizard/tunnel.wizard.scene').default
]

const bot = new Telegraf<BotContext>(config.telegram_options.bot_token);
const stage = new Stage<BotContext>(stages)

bot.use(session());
bot.use(stage.middleware());

//#endregion

bot.start((ctx) => {

	var username = ctx.from.username;

	if (!username) {
		ctx.reply('Ой, что-то пошло не так!');
		return
	}

	if (ctx.owners.length === 0) {

		ctx.owners.push(username);
		ctx.reply('Приветствую\nВы записанны как владелец', MAIN_KEYBOARD);
		saveUsers(ctx.owners);
		ctx.scene.enter('MAIN_SCENE');

	}
	else if (ctx.owners.includes(username)) {

		ctx.reply('Приветствую', MAIN_KEYBOARD);
		ctx.scene.enter('MAIN_SCENE');

	}
	else {

		ctx.reply('Приветствую, у вас нет доступа');

	}

})

// Проверка доступа
bot.use((ctx, next) => {

	const update = ctx.update['message'] || ctx.update['callback_query'];
	const username = update?.from.username

	if (ctx.owners) {

		if (ctx.owners.length === 0) {
			// next()
			ctx.scene.enter('MAIN_SCENE')
			return
		}
	
		if (username) {
			if (ctx.owners.includes(username)) {
				// next()
				ctx.scene.enter('MAIN_SCENE')
				return
			}
		}

	}

	ctx.reply('Нет доступа!');

})

bot.catch((err) => {

	if (bot.context.owners && bot.context.scripts) {
		if (saveUsers(bot.context.owners) && saveScript(bot.context.scripts)) {
			console.log('Работа завершена корректно!');
		}
		else {
			console.error('Работа завершена не корректно!');
		}
	}

	bot.stop(String(err))
	throw err

})

bot.launch().then(() => {

	ngrok.kill()
	ngrok.disconnect()
	ngrok.authtoken(config.ngrok_options.authtoken);
	
	bot.context.owners = getUsers() || [];
	bot.context.scripts = getScript() || {};
	bot.context.tunnel = [];
	// bot.context.scanning_pool = []
	// bot.context.scanning_pool.push('C:\\Users\\savamura\\Downloads\\forge-1.18.2-40.1.2-installer.jar.log')

	// const watcher = chokidar.watch(config.clam_options.dirs, {
	// 	persistent: true,
	// 	depth: 0,
	// 	ignoreInitial: true,
	// 	interval: 1000 * 15
	// })
	
	// watcher.on('add', (path) => {
		
	// 	if (!bot.context.scanning_pool) return
		
	// 	if (!bot.context.scanning_pool.includes(path)) {
	// 		bot.context.scanning_pool.push(path)
	// 	}

	// })

	console.log(new Date(), 'Bot started!');

});



process.once('SIGINT', () => { // Выполняется первым

	if (bot.context.owners && bot.context.scripts) {
		if (saveUsers(bot.context.owners) && saveScript(bot.context.scripts)) {
			console.log('Работа завершена корректно!');
		}
		else {
			console.error('Работа завершена не корректно!');
		}
	}

	bot.stop('SIGINT');

})

process.once('SIGTERM', () => bot.stop('SIGTERM'));