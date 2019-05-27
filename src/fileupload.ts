interface ISettings {
  onProgress: (progress: number, uploadId: number) => void
  onLoaded?: (event: ProgressEvent, uploadId: number) => void
  onError?: (event: ProgressEvent, uploadId: number) => void
  onAbort?: (uploadId: number) => void
}

export class FileUpload<T> {
  private xhr: XMLHttpRequest = new XMLHttpRequest()
  private callbacks: ISettings
  private uploadId!: number

  constructor (callbacks: ISettings) {
    this.callbacks = callbacks
    this.xhr.addEventListener('error', this.onError.bind(this))
    this.xhr.addEventListener('load', this.onLoaded.bind(this))
    this.xhr.addEventListener('abort', this.onAbort.bind(this))
    this.xhr.upload.addEventListener('progress', this.onProgress.bind(this))
  }

  public abort (): void {
    this.xhr.abort()
  }

  public upload (name: string, file: File, url: string, uploadId: number): void {
    this.uploadId = uploadId
    const formData = new FormData()
    formData.append(name, file)
    this.xhr.open('POST', url, true)
    this.xhr.send(formData)
  }

  private onError (event: ProgressEvent): void {
    if (this.callbacks.onError) {
      this.callbacks.onError(event, this.uploadId)
    }
  }

  private onLoaded (event: ProgressEvent): void {
    if (this.callbacks.onLoaded) {
      this.callbacks.onLoaded(event, this.uploadId)
    }
  }

  private onAbort (): void {
    if (this.callbacks.onAbort) {
      this.callbacks.onAbort(this.uploadId)
    }
  }

  private onProgress (event: ProgressEvent): void {
    if (event.lengthComputable) {
      const percentage = Math.round((event.loaded / event.total) * 100)
      this.callbacks.onProgress(percentage, this.uploadId)
    }
    else {
      this.callbacks.onProgress(-1, this.uploadId)
    }
  }

  public destroy (): void {
    this.xhr.removeEventListener('error', this.onError)
    this.xhr.removeEventListener('load', this.onLoaded)
    this.xhr.removeEventListener('abort', this.onAbort)
    this.xhr.upload.removeEventListener('progress', this.onProgress)
  }
}