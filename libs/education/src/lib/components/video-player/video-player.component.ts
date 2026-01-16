import {
  Component,
  input,
  output,
  effect,
  ElementRef,
  viewChild,
  signal,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Hls from 'hls.js';

@Component({
  selector: 'education-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-container" [class.loading]="isLoading()">
      <video
        #videoElement
        controls
        playsinline
        [poster]="thumbnailUrl()"
        (loadeddata)="onVideoLoaded()"
        (error)="onVideoError()"
        (timeupdate)="onTimeUpdate()"
        (ended)="onVideoEnded()"
      ></video>

      @if (isLoading()) {
        <div class="video-overlay">
          <div class="spinner"></div>
          <p>Video wird geladen...</p>
        </div>
      }

      @if (error()) {
        <div class="video-overlay error">
          <p>{{ error() }}</p>
          <button (click)="retry()">Erneut versuchen</button>
        </div>
      }

      <div class="video-progress">
        <div
          class="video-progress__bar"
          [style.width.%]="progressPercent()"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .video-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      background: #000;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      gap: 1rem;
    }

    .video-overlay.error {
      background: rgba(0, 0, 0, 0.9);
    }

    .video-overlay button {
      padding: 0.5rem 1rem;
      background: var(--color-primary, #1a365d);
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .video-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.2);
    }

    .video-progress__bar {
      height: 100%;
      background: var(--color-primary, #1a365d);
      transition: width 0.1s linear;
    }

    /* Hide default controls progress when showing custom */
    video::-webkit-media-controls-timeline {
      display: none;
    }
  `],
})
export class VideoPlayerComponent implements OnDestroy {
  private platformId = inject(PLATFORM_ID);

  playbackId = input.required<string>();
  signedToken = input<string>(); // Optional signed token for secure playback
  startTime = input<number>(0); // Resume from position

  completed = output<void>();
  progress = output<{ currentTime: number; duration: number }>();

  videoElement = viewChild.required<ElementRef<HTMLVideoElement>>('videoElement');

  isLoading = signal(true);
  error = signal<string | null>(null);
  progressPercent = signal(0);

  private hls: Hls | null = null;

  thumbnailUrl = () => {
    const id = this.playbackId();
    return id ? `https://image.mux.com/${id}/thumbnail.jpg?time=0` : '';
  };

  constructor() {
    effect(() => {
      const playbackId = this.playbackId();
      if (playbackId && isPlatformBrowser(this.platformId)) {
        this.initializePlayer(playbackId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyHls();
  }

  private initializePlayer(playbackId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    const video = this.videoElement().nativeElement;
    const token = this.signedToken();

    // Build the stream URL
    let streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
    if (token) {
      streamUrl += `?token=${token}`;
    }

    // Check if HLS.js is needed (Safari has native HLS support)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      // Use HLS.js for other browsers
      this.destroyHls();

      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      this.hls.loadSource(streamUrl);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.isLoading.set(false);
        const startTime = this.startTime();
        if (startTime > 0) {
          video.currentTime = startTime;
        }
      });

      this.hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              this.error.set('Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.');
              this.hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              this.error.set('Medienfehler. Video wird neu geladen...');
              this.hls?.recoverMediaError();
              break;
            default:
              this.error.set('Das Video konnte nicht geladen werden.');
              this.destroyHls();
              break;
          }
        }
      });
    } else {
      this.error.set('Ihr Browser unterstützt keine Videowiedergabe.');
      this.isLoading.set(false);
    }
  }

  private destroyHls(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }

  onVideoLoaded(): void {
    this.isLoading.set(false);
  }

  onVideoError(): void {
    if (!this.hls) {
      this.error.set('Das Video konnte nicht geladen werden.');
    }
    this.isLoading.set(false);
  }

  onTimeUpdate(): void {
    const video = this.videoElement().nativeElement;
    const percent = (video.currentTime / video.duration) * 100;
    this.progressPercent.set(isNaN(percent) ? 0 : percent);

    this.progress.emit({
      currentTime: video.currentTime,
      duration: video.duration,
    });
  }

  onVideoEnded(): void {
    this.completed.emit();
  }

  retry(): void {
    const playbackId = this.playbackId();
    if (playbackId) {
      this.initializePlayer(playbackId);
    }
  }

  // Public methods for external control
  play(): void {
    this.videoElement().nativeElement.play();
  }

  pause(): void {
    this.videoElement().nativeElement.pause();
  }

  seek(time: number): void {
    this.videoElement().nativeElement.currentTime = time;
  }
}
