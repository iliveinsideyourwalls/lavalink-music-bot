/**
 * Module imports.
 */
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

/**
 * Command options.
 */
@ApplyOptions<CommandOptions>({
	name: 'pause',
	description: 'Pauses your currently playing track.',
	fullCategory: ['music']
})
export class UserCommand extends Command {
	/**
	 * The main command method.
	 * @returns
	 */
	public async messageRun(_message: Message) {}
}
