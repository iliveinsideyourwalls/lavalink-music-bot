/**
 * Module imports.
 */
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

/**
 * Command options.
 */
@ApplyOptions<CommandOptions>({
	name: 'loop',
	aliases: ['repeat'],
	description:
		'Starts looping your currently playing track or the whole queue.',
	fullCategory: ['music']
})
export class UserCommand extends Command {
	/**
	 * The main command method.
	 * @returns
	 */
	public async messageRun(message: Message, args: Args) {
		if (!message.guild) return;
		const erelaPlayer = this.container.client.players.get(message.guild.id);
		const embedReply = new MessageEmbed();
		const { channel: userVoiceChannel } = message.member?.voice!;
		const { channel: botVoiceChannel } = message.guild.me?.voice!;

		try {
			const loopMode = await args.rest('string');

			if (!userVoiceChannel) {
				embedReply.setDescription(
					'You have to be connected to a voice channel before you can use this command!'
				);
				return message.reply({ embeds: [embedReply] });
			}

			if (userVoiceChannel.id !== botVoiceChannel?.id) {
				embedReply.setDescription(
					'You need to be in the same voice channel as the bot before you can use this command!'
				);
				return message.reply({ embeds: [embedReply] });
			}

			if (!erelaPlayer) {
				embedReply.setDescription(
					"There isn't an active player on this server!"
				);
				return message.reply({ embeds: [embedReply] });
			}

			if (!erelaPlayer.playing && !erelaPlayer.paused) {
				embedReply.setDescription(
					"There's nothing currently playing on this server!"
				);
				return message.reply({ embeds: [embedReply] });
			}

			switch (loopMode) {
				case 'track':
				case 'current': {
					erelaPlayer.setTrackRepeat(true);
					embedReply.setDescription(
						'Now looping the **current track**.'
					);
					break;
				}
				case 'all':
				case 'queue': {
					erelaPlayer.setQueueRepeat(true);
					embedReply.setDescription('Now looping the **queue**.');
					break;
				}
				case 'disable':
				case 'off': {
					if (erelaPlayer.trackRepeat) {
						erelaPlayer.setTrackRepeat(false);
					}

					if (erelaPlayer.queueRepeat) {
						erelaPlayer.setQueueRepeat(false);
					}

					embedReply.setDescription('Looping is now **disabled**.');
					break;
				}
				default: {
					embedReply.setDescription(
						'Invalid loop mode, the valid modes are: `current` `queue` `off`.'
					);
				}
			}

			return message.reply({ embeds: [embedReply] });
		} catch (error: any) {
			if (error.identifier === 'argsMissing') {
				if (!userVoiceChannel) {
					embedReply.setDescription(
						'You have to be connected to a voice channel before you can use this command!'
					);
					return message.reply({ embeds: [embedReply] });
				}

				if (userVoiceChannel.id !== botVoiceChannel?.id) {
					embedReply.setDescription(
						'You need to be in the same voice channel as the bot before you can use this command!'
					);
					return message.reply({ embeds: [embedReply] });
				}

				if (!erelaPlayer) {
					embedReply.setDescription(
						"There isn't an active player on this server!"
					);
					return message.reply({ embeds: [embedReply] });
				}

				if (!erelaPlayer.playing) {
					embedReply.setDescription(
						"There's nothing currently playing on this server!"
					);
					return message.reply({ embeds: [embedReply] });
				}

				if (erelaPlayer.trackRepeat) {
					erelaPlayer.setTrackRepeat(false);
					erelaPlayer.setQueueRepeat(true);
					embedReply.setDescription('Now looping the **queue**.');
					return message.reply({ embeds: [embedReply] });
				}

				if (erelaPlayer.queueRepeat) {
					erelaPlayer.setQueueRepeat(false);
					embedReply.setDescription('Looping is now **disabled**.');
					return message.reply({ embeds: [embedReply] });
				}

				if (!erelaPlayer.trackRepeat && !erelaPlayer.queueRepeat) {
					erelaPlayer.setTrackRepeat(true);
					embedReply.setDescription(
						'Now looping the **current track**.'
					);
					return message.reply({ embeds: [embedReply] });
				}
			}

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
}
