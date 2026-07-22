# McGorillaCSharp

A Discord music bot written in C# (.NET 10). It plays audio from YouTube links in a voice channel using bundled **yt-dlp** and **ffmpeg** — nothing needs to be installed globally.

## Commands

| Command | Description |
|---|---|
| `/play <link>` | Play a YouTube link, or queue it if something is already playing. |
| `/pause` | Pause the current track; run again to resume. |
| `/stop` | Stop playback, clear the queue and leave the voice channel. |
| `/list` | Show the current track and the queue. |
| `/clear` | Clear the queue but keep the current track playing. |
| `/quit` | Force the bot to leave the voice channel. |

You must be in a voice channel to use a command — the same one as the bot if it's already playing.

## Requirements

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications)) with the **Guilds** and **Guild Voice States** gateway intents
- Internet connection for the first build (it downloads ffmpeg and yt-dlp automatically)

## Getting started

1. Set your token in `McGorillaCSharp/appsettings.json` (or via the `DISCORD_TOKEN` environment variable):

   ```json
   {
     "Discord": {
       "Token": "YOUR_BOT_TOKEN_HERE",
       "GuildId": 0
     }
   }
   ```

2. Build and run:

   ```
   dotnet run --project McGorillaCSharp
   ```

3. Invite the bot to your server with the `applications.commands` and `bot` scopes (with *Connect* and *Speak* permissions), join a voice channel and run `/play`.

## Running in Docker

The image works on `linux/amd64` and `linux/arm64` — including a Raspberry Pi 3/4/5, as long as it runs a **64-bit OS** (the native voice libraries have no 32-bit ARM build). Inside the container, ffmpeg and yt-dlp are installed as Linux system tools; the `.exe` bundling only happens on Windows.

```
docker build -t mcgorila .
docker run -d --name mcgorila -e DISCORD_TOKEN=your_bot_token --restart unless-stopped mcgorila
```

Or with compose (reads `DISCORD_TOKEN` from the host environment or an `.env` file):

```
docker compose up -d --build
```

## Troubleshooting

- **`Bundled tool 'ffmpeg.exe' was not found`** — run `dotnet build` once with an internet connection.
- **Close code 4017** — `libdave.dll` must sit next to the executable (handled by the project file).
- **Commands don't appear in Discord** — check the log for `Registered ... commands in guild` and re-invite the bot with the `applications.commands` scope.
