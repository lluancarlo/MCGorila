import os
from dotenv import load_dotenv
import discord
import logging


class MyBot(discord.Bot):
    def __init__(self, description=None, *args, **options):
        super().__init__(description, *args, **options)
        load_dotenv()
        self.config_logging()
        self.list_of_guilds = [832763389742153738]
    
    def config_logging(self):
        logger = logging.getLogger('discord')
        logger.setLevel(logging.INFO)
        handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
        handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
        logger.addHandler(handler)
    
    # Events
    async def on_ready(self):
        # Tell server that bot is online
        for guild in bot.guilds:
            guild_has_music_channel = False

            for channel in guild.channels:
                if "music" in channel.name.lower():
                    await channel.send("Pai ta online 😎")
                    guild_has_music_channel = True
                    break
            
            if not guild_has_music_channel:
                print(f"Server {guild.name} doesn't have a channel called 'music'.")
                
        print(f"Bot logged in as {bot.user}")

bot = MyBot()

# @bot.slash_command(guild_ids=[832763389742153738])
# async def teste(ctx):
#     await ctx.respond("Testando!")

cogs_list = ['musiccog',]
for cog in cogs_list:
    bot.load_extension(f'cogs.{cog}')

@bot.command(guild_ids=bot.list_of_guilds, description="Atualizar comandos")
async def sync(ctx):
    await bot.sync_commands()
    await ctx.respond("Feito!")

bot.run(os.environ.get("TOKEN"))