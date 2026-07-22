namespace McGorillaCSharp.Models;

/// <summary>Outcome of a /stop request.</summary>
public abstract record StopResult
{
    /// <summary>The caller is not connected to a voice channel.</summary>
    public sealed record NotInVoice : StopResult;

    /// <summary>The bot is playing in a different voice channel.</summary>
    public sealed record WrongChannel : StopResult;

    /// <summary>There is nothing to stop.</summary>
    public sealed record NothingPlaying : StopResult;

    /// <summary>Queue cleared and the voice channel left.</summary>
    public sealed record Stopped : StopResult;
}
