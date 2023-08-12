import discord
from discord.ext import commands
from youtube_dl import YoutubeDL
    
async def setup(bot) -> None:
    await bot.add_cog(music_cog(bot))


class music_cog(commands.Cog):
    def __init__(self, bot) -> None:
        self.bot = bot
        self.list_max = 5
        self.last_music = None

        #all the music related stuff
        self.is_playing = False
        self.is_paused = False
        
        # 2d array containing [song, channel]
        self.music_queue = []
        self.YDL_OPTIONS = {'format': 'bestaudio', 'noplaylist':'True', 'cookiefile':'anyfile', 'verbose': 'False'}
        self.FFMPEG_OPTIONS = {'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5', 'options': '-vn'}

        self.vc = None


    #searching the item on youtube
    def search_yt(self, item) -> None:
        with YoutubeDL(self.YDL_OPTIONS) as ydl:
            try: 
                info = ydl.extract_info("ytsearch:%s" % item, download=False)['entries'][0]
            except Exception: 
                return False

        return {
            'title': info['title'],
            'source': info['formats'][0]['url'],
        }


    def play_next(self) -> None:
        if len(self.music_queue) > 0:
            self.is_playing = True

            #get the first url
            m_url = self.music_queue[0][0]['source']

            #remove the first element as you are currently playing it
            self.music_queue.pop(0)

            self.vc.play(discord.FFmpegPCMAudio(m_url, **self.FFMPEG_OPTIONS), after=lambda e: self.play_next())
        else:
            self.is_playing = False


    # infinite loop checking 
    async def play_music(self, ctx) -> None:
        if len(self.music_queue) > 0:
            self.is_playing = True

            m_url = self.music_queue[0][0]['source']

            #try to connect to voice channel if you are not already connected
            if self.vc == None or not self.vc.is_connected():
                self.vc = await self.music_queue[0][1].connect()

                #in case we fail to connect
                if self.vc == None:
                    await ctx.send("Nao consegui conectar no canal de voz.")
                    return
            else:
                await self.vc.move_to(self.music_queue[0][1])

            #remove the first element as you are currently playing it
            self.last_music = self.music_queue[0]
            self.music_queue.pop(0)

            await ctx.send(f"💬 Tocando **{self.last_music['title']}**.")
            self.vc.play(discord.FFmpegPCMAudio(m_url, **self.FFMPEG_OPTIONS), after=lambda e: self.play_next())
        else:
            self.is_playing = False


    @commands.command(name="play", help="Plays a selected song from youtube")
    async def play(self, ctx, *args) -> None:
        query = " ".join(args)
        
        voice_channel = ctx.author.voice.channel
        if voice_channel is None:
            await ctx.send("💬 Conecte a um canal de voz primeiro!")
        
        elif self.is_paused:
            self.vc.resume()

        else:
            #try to connect to voice channel if you are not already connected
            if self.vc == None or not self.vc.is_connected():
                self.vc = await voice_channel.connect()
                #in case we fail to connect
                if self.vc == None:
                    await ctx.send("🆘 Nao consegui conectar ao canal de voz.")
                    return
                await self.vc.move_to(voice_channel)
            
            # Download song
            song = self.search_yt(query)
            if type(song) == type(True):
                await ctx.send("🆘 Erro ao baixar musica. Formato incorreto. Playlist e lives nao sao suportados.")
                await self.vc.disconnect()
            
            self.music_queue.append([song, voice_channel])
            if self.is_playing:
                await ctx.send(f"💬 **{song['title']}** adicionada a playlist.")
            else:
                await self.play_music(ctx)


    @commands.command(name="stop", help="Stops the current song being played")
    async def stop(self, ctx, *args) -> None:
        if self.is_playing:
            self.is_playing = False
            self.is_paused = True
            self.vc.pause()
        elif self.is_paused:
            self.is_paused = False
            self.is_playing = True
            self.vc.resume()


    @commands.command(name = "resume", help="Resumes playing with the discord bot")
    async def resume(self, ctx, *args) -> None:
        if self.is_paused:
            self.is_paused = False
            self.is_playing = True
            self.vc.resume()
    
    
    @commands.command(name = "julio")
    async def repeat(self, ctx) -> None:
        if self.last_music != None:
            self.music_queue.append(self.last_music)
            if not self.is_playing:
                await self.play_music(ctx)


    @commands.command(name="skip", help="Skips the current song being played")
    async def skip(self, ctx) -> None:
        if self.vc != None and self.vc:
            self.vc.stop()
            await self.play_music(ctx)


    @commands.command(name="list", help="Displays the current songs in queue")
    async def queue(self, ctx) -> None:
        msg = ""

        if self.last_music != None:
            msg += "### Playlist:" + "\n"
            msg += "   **Tocando** - " + self.last_music['title'] + "\n"
        
        for i in range(0, len(self.music_queue)):
            if (i < self.list_max):
                msg += f"   **({i})** - " + self.music_queue[i][0]['title'] + "\n"
            
            else:
                msg += f"   +**{len(self.music_queue) - self.list_max}**"
                break

        if msg != "":
            await ctx.send(msg)
        else:
            await ctx.send("💬 Nenhuma musica na playlist")


    @commands.command(name="clear", help="Stops the music and clears the queue")
    async def clear(self, ctx) -> None:
        if self.vc != None and self.is_playing:
            self.vc.stop()
        self.music_queue = []
        await ctx.send("💬 Playlist deletada")


    @commands.command(name="quit", help="Kick the bot from VC")
    async def dc(self, ctx) -> None:
        self.is_playing = False
        self.is_paused = False
        await self.vc.disconnect()