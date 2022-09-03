import { Markup } from "telegraf";

import {
	DEVICE_BUTTON,
	USERS_BUTTON,
	USER_ADD_BUTTON,
	USER_REMOVE_BUTTON,
	BACK_BUTTON,
	STATUS_BUTTON,
	SCRIPT_BUTTON,
	POWER_BUTTON,
	ABORT_BUTTON,
	REBOOT_BUTTON,
	SHUTDOWN_BUTTON,
	SLEEP_BUTTON,
	HIBERNATE_BUTTON,
	SCRIPT_ADD_BUTTON,
	SCRIPT_REMOVE_BUTTON,
	SCRIPT_RUN_BUTTON,
	CONTINUE_BUTTON,
	LOCK_WORKSTATION_BUTTON,
	RUN_BUTTON,
	TUNNEL_BUTTON,
	ON_BUTTON,
	OFF_BUTTON,
	DEFRAG_BUTTON,
} from "./buttons";


export const CLEAR_KEYBOARD = Markup.removeKeyboard();
export const ABORT_KEYBOARD = Markup.keyboard([ABORT_BUTTON]).resize();

export const ABORT_CONTINUE_KEYBOARD = Markup.keyboard([
	CONTINUE_BUTTON,
	ABORT_BUTTON
]).resize();

export const ABORT_RUN_KEYBOARD = Markup.keyboard([
	RUN_BUTTON,
	ABORT_BUTTON
]).resize();

export const BACK_OFF_KEYBOARD = Markup.keyboard([
	OFF_BUTTON,
	BACK_BUTTON
]).resize();

export const BACK_ON_KEYBOARD = Markup.keyboard([
	ON_BUTTON,
	BACK_BUTTON
]).resize();



export const MAIN_KEYBOARD = Markup.keyboard([
	DEVICE_BUTTON,
	USERS_BUTTON,
], { columns: 1 }).resize();

export const USERS_SCENE_KEYBOARD = Markup.keyboard([
	USER_ADD_BUTTON,
	USER_REMOVE_BUTTON,
	BACK_BUTTON
], { columns: 1 }).resize();

export const DEVICE_SCENE_KEYBOARD = Markup.keyboard([
	STATUS_BUTTON,
	SCRIPT_BUTTON,
	TUNNEL_BUTTON,
	POWER_BUTTON,
	BACK_BUTTON
], { columns: 1 }).resize();

export const POWER_SCENE_KEYBOARD = Markup.keyboard([
	SHUTDOWN_BUTTON,
	REBOOT_BUTTON,
	LOCK_WORKSTATION_BUTTON,
	DEFRAG_BUTTON,
	// HIBERNATE_BUTTON,
	// SLEEP_BUTTON,
	BACK_BUTTON
], { columns: 1 }).resize();

export const SCRIPT_SCENE_KEYBOARD = Markup.keyboard([
	SCRIPT_RUN_BUTTON,
	SCRIPT_ADD_BUTTON,
	SCRIPT_REMOVE_BUTTON,
	BACK_BUTTON
], { columns: 1 }).resize();

// 11