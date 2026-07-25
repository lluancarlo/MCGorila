using System.Text;
using Discord;
using DiscordBot.Bot;
using DiscordBot.Models;
using DiscordBot.Services;

namespace DiscordBot.Commands;

/// <summary>
/// /list - shows the track that is playing and everything waiting behind it.
/// </summary>
public sealed class ListCommand(MusicService music) : ISlashCommand
{
    /// <summary>Queue entries shown before the rest is folded into "...and N more".</summary>
    private const int MaxVisibleEntries = 10;

    public string Name => "list";

    public SlashCommandProperties Build() => new SlashCommandBuilder()
        .WithName(Name)
        .WithDescription("Show the current track and the queue")
        .Build();

    public async Task ExecuteAsync(CommandContext context)
    {
        if (context.User is not { } user)
        {
            await context.ErrorAsync("This command only works inside a server.");
            return;
        }

        switch (music.GetPlaylist(user.Guild.Id))
        {
            case ListResult.NothingPlaying:
                await context.ErrorAsync("Nothing is playing right now.");
                break;

            case ListResult.Playing playing:
                await context.RespondAsync(BuildQueueEmbed(playing));
                break;
        }
    }

    private static Embed BuildQueueEmbed(ListResult.Playing playing)
    {
        var description = new StringBuilder();

        var marker = playing.IsPaused ? "⏸" : "▶";
        description.AppendLine($"{marker} [{playing.Current.Title}]({playing.Current.Url}) `{playing.Current.DurationText}`");

        foreach (var (track, index) in playing.Queue.Take(MaxVisibleEntries).Select((t, i) => (t, i)))
            description.AppendLine($"{index + 1}. [{track.Title}]({track.Url}) `{track.DurationText}`");

        if (playing.Queue.Count > MaxVisibleEntries)
            description.AppendLine($"…and {playing.Queue.Count - MaxVisibleEntries} more");

        var title = playing.Queue.Count == 0
            ? "Queue (nothing waiting)"
            : $"Queue ({playing.Queue.Count} waiting)";

        return Embeds.Message(title, description.ToString());
    }
}
