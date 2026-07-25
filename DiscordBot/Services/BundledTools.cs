namespace DiscordBot.Services;

/// <summary>
/// Locates the ffmpeg / yt-dlp executables that the build copies next to the application,
/// so the bot never depends on anything being installed globally.
/// </summary>
public static class BundledTools
{
    private static readonly string ToolsDirectory =
        Path.Combine(AppContext.BaseDirectory, "tools");

    public static string Ffmpeg { get; } = Resolve("ffmpeg");

    public static string YtDlp { get; } = Resolve("yt-dlp");

    /// <summary>Directory the downloaded audio files are cached in.</summary>
    public static string CacheDirectory { get; } =
        Path.Combine(AppContext.BaseDirectory, "cache");

    /// <summary>
    /// Throws a helpful error if a tool is missing instead of letting Process.Start fail later.
    /// </summary>
    public static void EnsureAvailable()
    {
        foreach (var tool in new[] { Ffmpeg, YtDlp })
        {
            if (!Exists(tool))
            {
                throw new FileNotFoundException(
                    $"Tool '{Path.GetFileName(tool)}' was not found at '{tool}' or on PATH. " +
                    "On Windows, run 'dotnet build' once with an internet connection to download it; " +
                    "on Linux, install it system-wide.", tool);
            }
        }

        Directory.CreateDirectory(CacheDirectory);
    }

    private static string Resolve(string name)
    {
        var fileName = OperatingSystem.IsWindows() ? name + ".exe" : name;
        var bundled = Path.Combine(ToolsDirectory, fileName);
        if (File.Exists(bundled))
        {
            return bundled;
        }

        // No bundled copy. On Linux (e.g. the Docker image) the tools are installed
        // system-wide, so fall back to the bare name and let Process.Start resolve it via PATH.
        return OperatingSystem.IsWindows() ? bundled : name;
    }

    private static bool Exists(string tool)
    {
        if (Path.IsPathRooted(tool))
        {
            return File.Exists(tool);
        }

        var path = Environment.GetEnvironmentVariable("PATH") ?? string.Empty;
        return path.Split(Path.PathSeparator, StringSplitOptions.RemoveEmptyEntries)
            .Any(dir => File.Exists(Path.Combine(dir, tool)));
    }
}
