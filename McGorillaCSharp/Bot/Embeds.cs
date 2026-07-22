using Discord;
using McGorillaCSharp.Models;

namespace McGorillaCSharp.Bot;

/// <summary>
/// Shared look of the bot's replies, so every command does not repeat the colour and layout.
/// </summary>
public static class Embeds
{
    private static readonly Color Accent = new(0x4F, 0xC3, 0xF7);

    /// <summary>A track centred embed: title, clickable song name, thumbnail and who asked for it.</summary>
    public static Embed Track(string title, TrackInfo track) =>
        new EmbedBuilder()
            .WithColor(Accent)
            .WithTitle(title)
            .WithDescription($"[{track.Title}]({track.Url})")
            .WithThumbnailUrl(track.Thumbnail)
            .WithFooter($"{track.DurationText} · requested by {track.RequestedBy}")
            .WithCurrentTimestamp()
            .Build();

    /// <summary>A plain message embed without a track attached.</summary>
    public static Embed Message(string title, string description) =>
        new EmbedBuilder()
            .WithColor(Accent)
            .WithTitle(title)
            .WithDescription(description)
            .WithCurrentTimestamp()
            .Build();
}
