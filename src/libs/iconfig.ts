export default interface IConfig {

	// clam_options: {
	// 	removeInfected: boolean,
	// 	quarantineInfected: boolean,
	// 	path: string,
	// 	scanArchives: boolean,
	// 	dirs: string[],
	// };

	telegram_options: {
		bot_token: string
	};
	
	ngrok_options: {
		authtoken: string
	}

}