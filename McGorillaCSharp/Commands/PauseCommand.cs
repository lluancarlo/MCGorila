using Discord;
using McGorillaCSharp.Bot;
using McGorillaCSharp.Models;
using McGorillaCSharp.Services;

namespace McGorillaCSharp.Commands;

/// <summary>
/// /pause - pauses the current track, or resumes it when it is already paused.
/// </summary>
public sealed class PauseCommand(MusicService music) : ISlashCommand
{
    public string Name => "pause";

    public SlashCommandProperties Build() => new SlashCommandBuilder()
        .WithName(Name)
        .WithDescription("Pause or resume the current track")
        .Build();

    public async Task ExecuteAsync(CommandContext context)
    {
        if (context.User is not { } user)
        {
            await context.ErrorAsync("This command only works inside a server.");
            return;
        }

        var result = await music.TogglePauseAsync(user);

        switch (result)
        {
            case PauseResult.NotInVoice:
                await context.ErrorAsync("You need to be in a voice channel first.");
                break;
            case PauseResult.WrongChannel:
                await context.ErrorAsync("I am already playing in another voice channel.");
                break;
            case PauseResult.NothingPlaying:
                await context.ErrorAsync("Nothing is playing right now.");
                break;
            case PauseResult.Paused paused:
                await context.RespondAsync(Embeds.Track("Paused", paused.Track));
                break;
            case PauseResult.Resumed resumed:
                await context.RespondAsync(Embeds.Track("Resumed", resumed.Track));
                break;
        }
    }
}
