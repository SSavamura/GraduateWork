import { Context } from "telegraf"
import { SceneContextScene, WizardContextWizard, WizardSessionData } from "telegraf/typings/scenes"
import { ScriptArray } from "./script";

interface BotContext extends Context {

	scene: SceneContextScene<BotContext, WizardSessionData>;
	wizard: WizardContextWizard<BotContext>;

	owners: string[];
	scripts?: ScriptArray;
	tunnel?: string[];
	// scanning_pool: string[];
	
}

export default BotContext