using Discord;
using McGorillaCSharp.Bot;
using McGorillaCSharp.Models;
using McGorillaCSharp.Services;

namespace McGorillaCSharp.Commands;

/// <summary>
/// /quit - forces the bot out of the voice channel. No voice channel checks on purpose: it is the
/// escape hatch for when the bot is stuck somewhere the caller cannot reach.
/// </summary>
public sealed class QuitCommand(MusicService music) : ISlashCommand
{
    public string Name => "quit";

    public SlashCommandProperties Build() => new SlashCommandBuilder()
        .WithName(Name)
        .WithDescription("Force the bot to leave the voice channel")
        .Build();

    public async Task ExecuteAsync(CommandContext context)
    {
        if (context.User is not { } user)
        {
            await context.ErrorAsync("This command only works inside a server.");
            return;
        }

        // Leaving waits for the playback loop to unwind, which can outlast the reply window.
        await context.DeferAsync();

        var result = await music.QuitAsync(user.Guild);

        switch (result)
        {
            case QuitResult.NotInChannel:
                await context.ErrorAsync("I am not in a voice channel.");
                break;
            case QuitResult.Left:
                await context.RespondAsync(Embeds.Message("Quit", "Left the voice channel."));
                break;
        }
    }
}
