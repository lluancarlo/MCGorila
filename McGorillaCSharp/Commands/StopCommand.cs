using Discord;
using McGorillaCSharp.Bot;
using McGorillaCSharp.Models;
using McGorillaCSharp.Services;

namespace McGorillaCSharp.Commands;

/// <summary>
/// /stop - clears the queue, stops the current track and leaves the voice channel.
/// </summary>
public sealed class StopCommand(MusicService music) : ISlashCommand
{
    public string Name => "stop";

    public SlashCommandProperties Build() => new SlashCommandBuilder()
        .WithName(Name)
        .WithDescription("Stop playback, clear the queue and leave the voice channel")
        .Build();

    public async Task ExecuteAsync(CommandContext context)
    {
        if (context.User is not { } user)
        {
            await context.ErrorAsync("This command only works inside a server.");
            return;
        }

        // Stopping waits for the playback loop to unwind, which can outlast the reply window.
        await context.DeferAsync();

        var result = await music.StopAsync(user);

        switch (result)
        {
            case StopResult.NotInVoice:
                await context.ErrorAsync("You need to be in a voice channel first.");
                break;
            case StopResult.WrongChannel:
                await context.ErrorAsync("I am already playing in another voice channel.");
                break;
            case StopResult.NothingPlaying:
                await context.ErrorAsync("Nothing is playing right now.");
                break;
            case StopResult.Stopped:
                await context.RespondAsync(Embeds.Message("Stopped", "Queue cleared and left the voice channel."));
                break;
        }
    }
}
