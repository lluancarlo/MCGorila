using System.Diagnostics;

namespace McGorillaCSharp.Services;

/// <summary>
/// Runs the bundled ffmpeg on a local audio file and exposes its stdout as a read-only stream of
/// 48 kHz 16-bit stereo PCM, which is exactly what Discord's voice encoder expects.
/// </summary>
public sealed class FfmpegPcmStream : IDisposable
{
    private readonly Process _process;

    private FfmpegPcmStream(Process process) => _process = process;

    public Stream Output => _process.StandardOutput.BaseStream;

    public static FfmpegPcmStream Open(string filePath)
    {
        var info = new ProcessStartInfo(BundledTools.Ffmpeg)
        {
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        string[] arguments =
        [
            "-hide_banner", "-loglevel", "error",
            "-i", filePath,
            "-ac", "2",           // stereo
            "-ar", "48000",       // 48 kHz
            "-f", "s16le",        // raw signed 16-bit little endian PCM
            "pipe:1"
        ];

        foreach (var argument in arguments)
            info.ArgumentList.Add(argument);

        var process = Process.Start(info)
                      ?? throw new InvalidOperationException("Could not start ffmpeg.");

        // Drain stderr so ffmpeg never blocks on a full error pipe.
        _ = process.StandardError.ReadToEndAsync();

        return new FfmpegPcmStream(process);
    }

    public void Dispose()
    {
        try
        {
            if (!_process.HasExited)
                _process.Kill(entireProcessTree: true);
        }
        catch
        {
            // Already exited.
        }

        _process.Dispose();
    }
}
