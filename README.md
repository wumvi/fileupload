### Install
```bash
npm i @wumvi/fileupload
```
## Usage

```typescript
function onProgress(progress:number, uploadId:number): void {
  console.log(progress, uploadId)
}

const upload = new FileUpload({
  onProgress: onProgress,
})

const uploadId = 1
const urlUpload = 'http://localhost:8140'
upload.upload('file', file, urlUpload , uploadId)
```