/**
 * Module imports.
 */
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<SubCommandPluginCommandOptions>({
	name: 'remove',
	description: 'Removes the specified track from the queue.',
	subCommands: ['range'],
	fullCategory: ['music']
})
export class UserCommand extends Command {
	public async messageRun(message: Message) {
		const embedReply = new MessageEmbed();
		try {
			return message.reply(':(');
		} catch (error: any) {
			this.container.client.logger.error(
				`There was an unexpected error in command "${this.name}"`,
				error
			);
			embedReply.setDescription(
				'There was an unexpected error while processing the command, try again later.'
			);
			return message.reply({ embeds: [embedReply] });
		}
	}

	public async range(_message: Message, _args: Args) {}
}
