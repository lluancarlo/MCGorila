const { REST, Routes } = require('discord.js');
require('dotenv').config();

const clientId = "1139338072618700880";
const guildId = "729445252527554651";

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started deleting all application (/) commands.`);

		// for guild-based commands
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
			.then(() => console.log('Successfully deleted all guild commands.'))
			.catch(console.error);

		// for global commands
		await rest.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => console.log('Successfully deleted all application commands.'))
			.catch(console.error);
		
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.log(error)
	}
})();