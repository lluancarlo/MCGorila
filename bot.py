import os
import discord
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv("env")
COGS_FILE = ("help_cog", "music_cog")
INTENTS = discord.Intents.default()
INTENTS.message_content = True

bot = commands.Bot(command_prefix='.', case_insensitive=False, intents=INTENTS)
bot.remove_command('help')

@bot.event
async def setup_hook() -> None:
    for file in COGS_FILE:
        await bot.load_extension(f"cogs.{file}")
        print(file + " loaded!")

# Run the bot with your token
bot.run(os.environ.get("TOKEN"))