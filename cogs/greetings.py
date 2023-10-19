import discord
from discord.ext import commands

def setup(bot): # this is called by Pycord to setup the cog
    bot.add_cog(Greetings(bot)) # add the cog to the bot

class Greetings(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @discord.slash_command()
    async def ping(self, ctx):
        await ctx.respond(f"Pong! Latency is {self.bot.latency}")