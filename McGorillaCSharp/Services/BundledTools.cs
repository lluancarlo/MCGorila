namespace McGorillaCSharp.Services;

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
            if (!File.Exists(tool))
            {
                throw new FileNotFoundException(
                    $"Bundled tool '{Path.GetFileName(tool)}' was not found at '{tool}'. " +
                    "Run 'dotnet build' once with an internet connection to download it.", tool);
            }
        }

        Directory.CreateDirectory(CacheDirectory);
    }

    private static string Resolve(string name)
    {
        var fileName = OperatingSystem.IsWindows() ? name + ".exe" : name;
        return Path.Combine(ToolsDirectory, fileName);
    }
}
