const fs = require('node:fs');
const path = require('node:path');
const logger = require('./utils/logHelper')
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require("discord-player");
const { YoutubeExtractor, SpotifyExtractor } = require('@discord-player/extractor');
require('dotenv').config();

// Create a new client instance
const client = new Client({ 
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] 
});
client.commands = new Collection();

const player = new Player(client);
player.extractors.register(YoutubeExtractor, {});
player.extractors.register(SpotifyExtractor, {});

// Add all commands dinamically
let count = 0;
let foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	count += commandFiles.length;
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			logger.general(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
logger.general(`[LOADING] ${count} commands are loaded.`)

// Add all events dinamically
count = 0;
foldersPath = path.join(__dirname, 'events');
const eventFolders = fs.readdirSync(foldersPath);
for (const folder of eventFolders) {
	// Grab all the event files from the events directory you created earlier
	const eventsPath = path.join(foldersPath, folder);
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
	count += eventFiles.length;
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.isPlayer) {
			player.on(event.name, (interaction) => event.execute(interaction));
		} else if (event.once) {
			client.once(event.name, (interaction) => event.execute(interaction));
		} else {
			client.on(event.name, (interaction) => event.execute(interaction));
		}
	}
}
logger.general(`[LOADING] ${count} events are loaded.`)

// Log in to Discord with your client's token
client.login(process.env.TOKEN);