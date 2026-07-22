namespace McGorillaCSharp.Models;

/// <summary>
/// A single YouTube video queued for playback, plus who asked for it.
/// </summary>
/// <param name="Id">YouTube video id, also used as the cache file name.</param>
/// <param name="Title">Video title shown in Discord.</param>
/// <param name="Url">Original watch url.</param>
/// <param name="Duration">Video length, <c>null</c> for live streams.</param>
/// <param name="Thumbnail">Thumbnail url used in the embeds.</param>
/// <param name="RequestedBy">Display name of the user that ran /play.</param>
public sealed record TrackInfo(
    string Id,
    string Title,
    string Url,
    TimeSpan? Duration,
    string? Thumbnail,
    string RequestedBy)
{
    public string DurationText => Duration is { } d
        ? (d.TotalHours >= 1 ? d.ToString(@"h\:mm\:ss") : d.ToString(@"m\:ss"))
        : "live";
}
