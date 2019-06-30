import { FileApi, IUploadFileControl } from '../src/file-api'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

const apiUrlInput = document.getElementById('apiUrl') as HTMLInputElement
const sessionIdInput = document.getElementById('sessionId') as HTMLInputElement
const filesInput = document.getElementById('files') as HTMLInputElement

apiUrlInput.value = localStorage.getItem(apiUrlInput.id)!
apiUrlInput.addEventListener('keyup', () => {
  localStorage.setItem(apiUrlInput.id, apiUrlInput.value)
})

sessionIdInput.value = localStorage.getItem(sessionIdInput.id)!
sessionIdInput.addEventListener('keyup', () => {
  localStorage.setItem(sessionIdInput.id, sessionIdInput.value)
})

filesInput.addEventListener('change', onFileInputChange)

const control:IUploadFileControl  = {
  onProgress: (progress => console.log(progress)),
  abort: () => {}
}

function onFileInputChange (event: Event) {
  const files = Array.from((event as HTMLInputEvent).target.files!)
  console.log(files)

  const apiUrl = apiUrlInput.value
  const sessionId = sessionIdInput.value

  const fileApi = new FileApi(apiUrl, sessionId)
  fileApi.uploadFiles(files, control).then((result: any) => {
    console.log(result)
  }).catch((error: any) => {
    console.error(error)
  })
}

const abortBtn = document.getElementById('abortBtn') as HTMLButtonElement
abortBtn.addEventListener('click', () => {
  control.abort && control.abort()
})