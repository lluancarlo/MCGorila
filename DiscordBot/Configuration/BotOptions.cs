namespace DiscordBot.Configuration;

/// <summary>
/// Settings bound from the "Discord" section of appsettings.json.
/// </summary>
public sealed class BotOptions
{
    public const string SectionName = "Discord";

    /// <summary>Bot token. Can also be supplied through the DISCORD_TOKEN environment variable.</summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Optional guild to register the slash commands in. When 0 the commands are registered in
    /// every guild the bot is a member of, which makes them show up instantly.
    /// </summary>
    public ulong GuildId { get; set; }

    /// <summary>
    /// How long the bot may stay connected to a voice channel, in seconds, before it leaves
    /// automatically. 0 disables the timeout.
    /// </summary>
    public int ChannelTimeoutSeconds { get; set; }
}
