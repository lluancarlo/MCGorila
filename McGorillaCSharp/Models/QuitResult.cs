namespace McGorillaCSharp.Models;

/// <summary>Outcome of a /quit request.</summary>
public abstract record QuitResult
{
    /// <summary>The bot is not in a voice channel, so there is nothing to leave.</summary>
    public sealed record NotInChannel : QuitResult;

    /// <summary>The bot dropped everything and left the voice channel.</summary>
    public sealed record Left : QuitResult;
}
