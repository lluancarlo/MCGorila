namespace McGorillaCSharp.Models;

/// <summary>
/// Outcome of a /play request. The command turns this into a reply, the service decides
/// which case applies, so the two never have to share Discord types.
/// </summary>
public abstract record PlayResult
{
    /// <summary>The caller is not connected to a voice channel.</summary>
    public sealed record NotInVoice : PlayResult;

    /// <summary>The bot is already playing in a different voice channel.</summary>
    public sealed record WrongChannel : PlayResult;

    /// <summary>The given text is not a usable http(s) link.</summary>
    public sealed record InvalidLink : PlayResult;

    /// <summary>yt-dlp could not read the video behind the link.</summary>
    public sealed record NotFound : PlayResult;

    /// <summary>Nothing was playing, so this track started immediately.</summary>
    public sealed record Started(TrackInfo Track) : PlayResult;

    /// <summary>Something was already playing, so the track was queued at <paramref name="Position"/>.</summary>
    public sealed record Queued(TrackInfo Track, int Position) : PlayResult;
}
