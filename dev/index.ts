import { FileUpload } from '../src/fileupload'

const fileInput = <HTMLInputElement>document.getElementById('file')
fileInput.addEventListener('change', onFileInputChange)

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

const upload = new FileUpload({
  onProgress: onFileProgress,
  onError: onFileError,
  onAbort: onAbort,
})

function onFileProgress (progress: number, uploadId: number): void {
  console.log(progress, uploadId)
}

function onFileError (): void {
  console.log('error')
}

function onAbort (): void {
  console.log('onAbort')
}

function onFileInputChange (event: Event) {
  const files = (event as HTMLInputEvent).target.files!
  upload.upload('file', files[0], 'http://localhost:8140', 123)
}

document.getElementById('abort')!.addEventListener('click', () => {
  upload.abort()
})