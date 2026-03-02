import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js";

const PROXY_BASE = `https://vqzdpbcftwvyerxwkhsj.supabase.co/functions/v1/peertube-proxy`;

interface PeerTubePlayerProps {
  hlsUrl: string; // The raw PeerTube HLS master playlist URL
  poster?: string;
  title?: string;
}

function getProxiedUrl(peerTubePath: string): string {
  // Extract path from full PeerTube URL
  try {
    const parsed = new URL(peerTubePath);
    const url = new URL(PROXY_BASE);
    url.searchParams.set("path", parsed.pathname);
    return url.toString();
  } catch {
    // Already a path
    const url = new URL(PROXY_BASE);
    url.searchParams.set("path", peerTubePath);
    return url.toString();
  }
}

function getProxiedThumbnail(thumbnailPath: string): string {
  if (!thumbnailPath || thumbnailPath === "/placeholder.svg") return "/placeholder.svg";
  const url = new URL(PROXY_BASE);
  url.searchParams.set("path", thumbnailPath);
  return url.toString();
}

const PeerTubePlayer = ({ hlsUrl, poster, title }: PeerTubePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !hlsUrl) return;

    const proxiedM3u8 = getProxiedUrl(hlsUrl);
    const proxiedPoster = poster ? getProxiedThumbnail(poster) : undefined;

    const art = new Artplayer({
      container: containerRef.current,
      url: proxiedM3u8,
      type: 'm3u8',
      poster: proxiedPoster,
      volume: 0.7,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: false,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      theme: "hsl(var(--primary))",
      lang: "en",
      moreVideoAttr: {
        crossOrigin: "anonymous",
      },
      customType: {
        m3u8: function (video: HTMLVideoElement, url: string) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
              xhrSetup: (xhr: XMLHttpRequest, xhrUrl: string) => {
                // All URLs should already be proxied via m3u8 rewriting
                // but add ngrok header just in case
                xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
              },
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, (_, data) => {
              console.error("HLS error:", data);
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    console.log("Network error, trying to recover...");
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    console.log("Media error, trying to recover...");
                    hls.recoverMediaError();
                    break;
                  default:
                    hls.destroy();
                    break;
                }
              }
            });

            // Clean up HLS on art destroy
            art.on("destroy", () => {
              hls.destroy();
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          }
        },
      },
    });

    artRef.current = art;

    return () => {
      if (artRef.current) {
        artRef.current.destroy(false);
        artRef.current = null;
      }
    };
  }, [hlsUrl, poster, title]);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-video"
      style={{ maxHeight: "80vh" }}
    />
  );
};

export default PeerTubePlayer;
