import json
import discord
from discord.ext import commands

    
async def setup(bot) -> None:
    await bot.add_cog(help_cog(bot))


class help_cog(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.text_channel_list = []
        self.help_message = f"""
## Comandos:
Use `{bot.command_prefix}` antes de todas os comandos. Exemplo: `!stop`
* **help** - Mostra todos os comandos
### Player de Musica
* **play** - Procura video no Youtube e toca ou da play em musica em pausa
* **stop** - Pausa ou continua musica atual
* **resume** - Continua musica atual
* **skip** - Pula musica atual
* **list** - Lista musicas na playlist
* **clear** - Para a musica e limpa playlist
* **quit** - Forca bot a sair do chat
"""

    
    #some debug info so that we know the bot has started    
    @commands.Cog.listener()
    async def on_ready(self) -> None:
        for guild in self.bot.guilds:
            for channel in guild.text_channels:
                self.text_channel_list.append(channel)


    @commands.command(name="help", help="Displays all the available commands")
    async def help(self, ctx) -> None:
        await ctx.send(self.help_message)