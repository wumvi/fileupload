import { IApiErrorResponse, IApiSuccessResponse, JsonApi } from '@wumvi/jsonapi'

export interface IUploadFileControl {
  onProgress?: (progress: number) => void
  onLoaded?: () => void
  onError?: () => any
  onAbort?: (this: XMLHttpRequest) => void

  abort?: () => void
}

export interface IApiGetSessionResponse {
  result: {
    session_id: string
    storage_url: string
  }
}

export class FileApi {
  private readonly sessionId: string
  private readonly api: JsonApi

  constructor (apiUrl: string, sessionId: string) {
    this.sessionId = sessionId
    this.api = new JsonApi(apiUrl)
  }

  getStorage () {
    return this.api.call<{ session_id: string }, (IApiGetSessionResponse & IApiErrorResponse)[]>([
      { id: '1', method: 'file.get_session', params: { session_id: this.sessionId } }
    ]).then((result: (IApiGetSessionResponse & IApiErrorResponse)[]) => {
      if (result[0].error) {
        return Promise.reject(result[0].error.code)
      } else {
        return Promise.resolve(result as IApiGetSessionResponse[])
      }
    })
  }

  uploadFiles (files: File[], control: IUploadFileControl) {
    return new Promise((resolve, reject) => {
      this.getStorage().then(this.onGetFileSession.bind(this, resolve, reject, files, control)).catch(reject)
    })
  }

  private onGetFileSession (
    resolve: Function,
    reject: Function,
    files: File[],
    control: IUploadFileControl,
    result: IApiGetSessionResponse[]
  ) {
    const fileSessionId = result[0].result.session_id
    const storageUrl = 'https://' + result[0].result.storage_url + '/upload/'

    const formData = new FormData()
    formData.append('file_session_id', fileSessionId)
    formData.append('id', '1')
    files.map(file => formData.append('files[]', file))
    const xhr = new XMLHttpRequest()
    if (control.onError) {
      xhr.onerror = () => {
        control.onError!()
        reject('error-during-request')
      }
    }
    if (control.onAbort) {
      xhr.onabort = control.onAbort
    }

    xhr.onload = () => {
      this.onFileUploadDone(xhr, resolve, reject)
      control.onLoaded && control.onLoaded()
    }

    if (control.onProgress) {
      xhr.upload.onprogress = this.onFileUploadProgress.bind(this, control)
    }

    control.abort = () => {
      xhr.abort()
    }

    xhr.open('POST', storageUrl, true)
    xhr.send(formData)
  }

  private onFileUploadDone (xhr: XMLHttpRequest, resolve: Function, reject: Function): void {
    if (xhr.status !== 200) {
      reject('wrong-response-code')
      return
    }

    try {
      const json = JSON.parse(xhr.responseText) as (IApiSuccessResponse & IApiErrorResponse)[]
      if (json[0].error) {
        reject(json[0].error.code)
      } else {
        resolve(json[0].result)
      }
    } catch (e) {
      reject('wrong-json')
    }
  }

  private onFileUploadProgress (control: IUploadFileControl, event: ProgressEvent): void {
    if (event.lengthComputable) {
      const percentage = Math.round((event.loaded / event.total) * 100)
      control.onProgress!(percentage)
    } else {
      control.onProgress!(-1)
    }
  }
}