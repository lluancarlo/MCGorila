namespace McGorillaCSharp.Models;

/// <summary>Outcome of a /pause request.</summary>
public abstract record PauseResult
{
    /// <summary>The caller is not connected to a voice channel.</summary>
    public sealed record NotInVoice : PauseResult;

    /// <summary>The bot is playing in a different voice channel.</summary>
    public sealed record WrongChannel : PauseResult;

    /// <summary>There is no track to pause.</summary>
    public sealed record NothingPlaying : PauseResult;

    public sealed record Paused(TrackInfo Track) : PauseResult;

    public sealed record Resumed(TrackInfo Track) : PauseResult;
}
