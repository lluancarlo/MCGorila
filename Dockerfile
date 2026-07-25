# Multi-arch image: linux/amd64 and linux/arm64 (e.g. Raspberry Pi 3/4/5 with a 64-bit OS).
# 32-bit ARM is not supported: the native voice libraries (opus/libsodium/libdave) ship no armv7 build.

# Build on the host's native platform and cross-compile via -a $TARGETARCH,
# so arm64 images don't run the compiler under QEMU emulation.
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG TARGETARCH
WORKDIR /src

# Restore first so the NuGet layer is cached between builds.
COPY McGorillaCSharp/McGorillaCSharp.csproj McGorillaCSharp/
RUN arch=${TARGETARCH:-$(dpkg --print-architecture)} \
 && dotnet restore McGorillaCSharp -a "$arch"

COPY McGorillaCSharp/ McGorillaCSharp/
RUN arch=${TARGETARCH:-$(dpkg --print-architecture)} \
 && dotnet publish McGorillaCSharp -a "$arch" -c Release --no-restore -o /app

FROM mcr.microsoft.com/dotnet/runtime:10.0
ARG TARGETARCH

# The Windows build bundles ffmpeg.exe / yt-dlp.exe next to the app; on Linux the bot
# resolves the tools from PATH instead, so install them system-wide:
# ffmpeg from Debian, yt-dlp as the official standalone binary for the target CPU.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg curl ca-certificates \
 && arch=${TARGETARCH:-$(dpkg --print-architecture)} \
 && case "$arch" in \
      amd64) ytdlp=yt-dlp_linux ;; \
      arm64) ytdlp=yt-dlp_linux_aarch64 ;; \
      *) echo "Unsupported architecture: $arch" >&2; exit 1 ;; \
    esac \
 && curl -fsSL "https://github.com/yt-dlp/yt-dlp/releases/latest/download/$ytdlp" \
      -o /usr/local/bin/yt-dlp \
 && chmod +x /usr/local/bin/yt-dlp \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app .

# Pass the bot token at run time: docker run -e DISCORD_TOKEN=...
ENTRYPOINT ["dotnet", "McGorillaCSharp.dll"]
