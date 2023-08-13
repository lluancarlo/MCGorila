import json
import random
import discord
from discord.ext import commands

    
async def setup(bot) -> None:
    await bot.add_cog(help_cog(bot))


class help_cog(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.text_channel_list = []
        self.help_embed = discord.Embed(
            type="rich",
            color=discord.Colour.green(),
            title="Comandos",
            description=f"""
**help** - Mostra todos os comandos
**play** - Procura video no Youtube e toca ou da play em musica em pausa
**stop** - Pausa ou continua musica atual
**resume** - Continua musica atual
**skip** - Pula musica atual
**list** - Lista musicas na playlist
**clear** - Para a musica e limpa playlist
**quit** - Forca bot a sair do chat
**julio** - Repete ultima musica ou adiciona ela no final da playlist
\n
**Obs**: Use `{bot.command_prefix}` antes de todas os comandos. Exemplo: `{bot.command_prefix}stop`
Se não gostou faz o seguinte: ***ME PANHA*** !
"""
        )
        self.thumbnail_list = [
            "https://media.tenor.com/MGo2ZucU3SEAAAAd/mc-gorila.gif",
            "https://i.makeagif.com/media/4-29-2017/5wYPGI.gif",
            "https://j.gifs.com/mlXY8P.gif",
            "https://media.tenor.com/Nx_gxPSDzcsAAAAd/mc-gorila-thank-you.gif"
        ]

    
    #some debug info so that we know the bot has started    
    @commands.Cog.listener()
    async def on_ready(self) -> None:
        for guild in self.bot.guilds:
            for channel in guild.text_channels:
                self.text_channel_list.append(channel)


    @commands.command(name="help", help="Displays all the available commands")
    async def help(self, ctx) -> None:
        self.help_embed.set_thumbnail(url=self.thumbnail_list[random.randint(0, len(self.thumbnail_list))])
        await ctx.send(embed=self.help_embed)