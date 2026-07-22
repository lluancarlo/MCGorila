using Discord;
using McGorillaCSharp.Bot;
using McGorillaCSharp.Models;
using McGorillaCSharp.Services;

namespace McGorillaCSharp.Commands;

/// <summary>
/// /clear - empties the queue while the current track keeps playing.
/// </summary>
public sealed class ClearCommand(MusicService music) : ISlashCommand
{
    public string Name => "clear";

    public SlashCommandProperties Build() => new SlashCommandBuilder()
        .WithName(Name)
        .WithDescription("Clear the queue but keep the current track playing")
        .Build();

    public async Task ExecuteAsync(CommandContext context)
    {
        if (context.User is not { } user)
        {
            await context.ErrorAsync("This command only works inside a server.");
            return;
        }

        switch (await music.ClearAsync(user))
        {
            case ClearResult.NotInVoice:
                await context.ErrorAsync("You need to be in a voice channel first.");
                break;
            case ClearResult.WrongChannel:
                await context.ErrorAsync("I am already playing in another voice channel.");
                break;
            case ClearResult.NothingPlaying:
                await context.ErrorAsync("Nothing is playing right now.");
                break;
            case ClearResult.Cleared { RemovedCount: 0 }:
                await context.RespondAsync(Embeds.Message("Queue cleared", "The queue was already empty; the current track keeps playing."));
                break;
            case ClearResult.Cleared cleared:
                await context.RespondAsync(Embeds.Message(
                    "Queue cleared",
                    $"Removed {cleared.RemovedCount} track{(cleared.RemovedCount == 1 ? "" : "s")}; the current track keeps playing."));
                break;
        }
    }
}
