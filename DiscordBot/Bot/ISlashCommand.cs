using Discord;

namespace DiscordBot.Bot;

/// <summary>
/// One slash command. Implement this in a file under Commands/ and register it in Program.cs;
/// <see cref="CommandRegistry"/> takes care of publishing it to Discord and routing calls to it.
/// </summary>
public interface ISlashCommand
{
    /// <summary>Command name without the slash. Has to match the name used in <see cref="Build"/>.</summary>
    string Name { get; }

    /// <summary>The definition sent to Discord: description, options, permissions.</summary>
    SlashCommandProperties Build();

    /// <summary>Runs the command. Never called on the gateway task.</summary>
    Task ExecuteAsync(CommandContext context);
}
