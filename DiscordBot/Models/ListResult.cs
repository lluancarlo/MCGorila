namespace DiscordBot.Models;

/// <summary>Outcome of a /list request.</summary>
public abstract record ListResult
{
    /// <summary>The bot is idle in this guild: no current track, empty queue.</summary>
    public sealed record NothingPlaying : ListResult;

    /// <summary>The current track plus everything waiting behind it, oldest first.</summary>
    public sealed record Playing(TrackInfo Current, IReadOnlyList<TrackInfo> Queue, bool IsPaused) : ListResult;
}
