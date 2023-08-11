import discord
from discord.ext import commands

    
async def setup(bot) -> None:
    await bot.add_cog(help_cog(bot))


class help_cog(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.text_channel_list = []
        self.help_message = """
```
General commands:
/help - displays all the available commands
/p <keywords> - finds the song on youtube and plays it in your current channel. Will resume playing the current song if it was paused
/q - displays the current music queue
/skip - skips the current song being played
/clear - Stops the music and clears the queue
/leave - Disconnected the bot from the voice channel
/pause - pauses the current song being played or resumes if already paused
/resume - resumes playing the current song
```
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