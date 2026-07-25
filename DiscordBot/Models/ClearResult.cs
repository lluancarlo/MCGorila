namespace DiscordBot.Models;

/// <summary>Outcome of a /clear request.</summary>
public abstract record ClearResult
{
    /// <summary>The caller is not connected to a voice channel.</summary>
    public sealed record NotInVoice : ClearResult;

    /// <summary>The bot is playing in a different voice channel.</summary>
    public sealed record WrongChannel : ClearResult;

    /// <summary>There is no playback session to clear.</summary>
    public sealed record NothingPlaying : ClearResult;

    /// <summary>The queue was emptied; the current track keeps playing.</summary>
    public sealed record Cleared(int RemovedCount) : ClearResult;
}
