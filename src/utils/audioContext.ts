export class AudioContextManager {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private userInteractionPromise: Promise<void> | null = null;
  private boundUserInteractionHandler: () => void;

  constructor() {
    this.boundUserInteractionHandler = this.handleUserInteraction.bind(this);
    this.setupUserInteractionPromise();
  }

  private setupUserInteractionPromise() {
    if (this.userInteractionPromise) return;

    this.userInteractionPromise = new Promise<void>((resolve) => {
      const events = ['click', 'touchstart', 'keydown'];
      
      const cleanup = () => {
        events.forEach(event => {
          document.removeEventListener(event, this.boundUserInteractionHandler);
        });
      };

      events.forEach(event => {
        document.addEventListener(event, this.boundUserInteractionHandler, { once: true });
      });

      (this.boundUserInteractionHandler as any).resolve = () => {
        cleanup();
        resolve();
      };
    });
  }

  private async handleUserInteraction() {
    try {
      if (this.audioContext) {
        await this.audioContext.resume();
      }
      (this.boundUserInteractionHandler as any).resolve?.();
    } catch (error) {
      console.error('Error handling user interaction:', error);
    }
  }

  private async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    await this.userInteractionPromise;

    this.initializationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        await this.audioContext.resume();

        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          },
          video: false
        });

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        source.connect(this.analyser);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        
        this.isInitialized = true;
        resolve();
      } catch (error) {
        this.cleanup();
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  private cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
    this.dataArray = null;
    this.isInitialized = false;
    this.initializationPromise = null;
    this.userInteractionPromise = null;
    this.setupUserInteractionPromise();
  }

  async startMonitoring() {
    try {
      console.log('请点击页面任意位置以启动音频监控');
      await this.initialize();
    } catch (error) {
      this.cleanup();
      throw new Error('Failed to initialize audio context: ' + (error as Error).message);
    }
  }

  stopMonitoring() {
    this.cleanup();
  }

  getVolume(): number {
    if (!this.analyser || !this.dataArray || !this.isInitialized) {
      return 0;
    }

    try {
      this.analyser.getByteFrequencyData(this.dataArray);
      const average = this.dataArray.reduce((acc, value) => acc + value, 0) / this.dataArray.length;
      return Math.min(Math.round((average / 255) * 100), 100);
    } catch (error) {
      console.error('Error getting volume:', error);
      return 0;
    }
  }

  isActive(): boolean {
    return this.isInitialized && this.audioContext !== null && this.audioContext.state === 'running';
  }
}

export const audioContextManager = new AudioContextManager(); 