import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import WriteTopIcon from './WriteTopIcon'
import type { CommunityMediaAttachment } from './writeTypes'
import './MediaActions.css'

type MediaActionsProps = {
  value: CommunityMediaAttachment[]
  onChange: (value: CommunityMediaAttachment[]) => void
}

function createAttachmentId(kind: CommunityMediaAttachment['kind'], file: File) {
  return `${kind}-${Date.now()}-${file.name}-${file.size}`
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))}KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

function MediaActions({ value, onChange }: MediaActionsProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const generatedPreviewUrlRef = useRef<Record<string, string>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    setPreviewUrls((currentUrls) => {
      const nextUrls = { ...currentUrls }
      const activeIds = new Set(value.map((attachment) => attachment.id))

      value.forEach((attachment) => {
        if (!nextUrls[attachment.id]) {
          if (attachment.url) {
            nextUrls[attachment.id] = attachment.url
            return
          }

          if (attachment.file) {
            const generatedUrl = URL.createObjectURL(attachment.file)
            nextUrls[attachment.id] = generatedUrl
            generatedPreviewUrlRef.current[attachment.id] = generatedUrl
          }
        }
      })

      Object.keys(nextUrls).forEach((id) => {
        if (!activeIds.has(id)) {
          if (generatedPreviewUrlRef.current[id]) {
            URL.revokeObjectURL(generatedPreviewUrlRef.current[id])
            delete generatedPreviewUrlRef.current[id]
          }

          delete nextUrls[id]
        }
      })

      return nextUrls
    })
  }, [value])

  useEffect(() => {
    return () => {
      Object.values(generatedPreviewUrlRef.current).forEach((url) => URL.revokeObjectURL(url))
      generatedPreviewUrlRef.current = {}
    }
  }, [])

  const handleSelectFiles = (
    kind: CommunityMediaAttachment['kind'],
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    const nextAttachments = selectedFiles.map((file) => ({
      id: createAttachmentId(kind, file),
      kind,
      file,
      url: typeof URL !== 'undefined' ? URL.createObjectURL(file) : undefined,
      name: file.name,
      size: file.size,
    }))

    onChange([...value, ...nextAttachments])
    event.currentTarget.value = ''
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    onChange(value.filter((attachment) => attachment.id !== attachmentId))
  }

  return (
    <div className="community-write-media">
      <div className="community-write-media-row">
        <button
          type="button"
          className="community-write-media-button"
          onClick={() => imageInputRef.current?.click()}
        >
          <WriteTopIcon kind="image" />
          <span>사진</span>
        </button>
        <button
          type="button"
          className="community-write-media-button"
          onClick={() => videoInputRef.current?.click()}
        >
          <WriteTopIcon kind="video" />
          <span>동영상</span>
        </button>
      </div>

      <input
        ref={imageInputRef}
        className="community-write-media-input"
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => handleSelectFiles('image', event)}
      />
      <input
        ref={videoInputRef}
        className="community-write-media-input"
        type="file"
        accept="video/*"
        multiple
        onChange={(event) => handleSelectFiles('video', event)}
      />

      {value.length > 0 && (
        <ul className="community-write-media-preview-list" aria-label="업로드한 미디어">
          {value.map((attachment) => {
            const previewUrl = previewUrls[attachment.id]
            const fileName = attachment.name ?? attachment.file?.name ?? '업로드한 미디어'
            const fileSize = attachment.size ?? attachment.file?.size ?? 0

            return (
              <li key={attachment.id} className="community-write-media-preview">
                <div className="community-write-media-preview__thumb">
                  {attachment.kind === 'image' && previewUrl ? (
                    <img src={previewUrl} alt="" aria-hidden="true" />
                  ) : (
                    <video src={previewUrl} muted aria-hidden="true" />
                  )}
                </div>
                <div className="community-write-media-preview__info">
                  <strong>{fileName}</strong>
                  <span>{attachment.kind === 'image' ? '사진' : '동영상'} · {formatFileSize(fileSize)}</span>
                </div>
                <button
                  type="button"
                  className="community-write-media-preview__remove"
                  aria-label={`${fileName} 삭제`}
                  onClick={() => handleRemoveAttachment(attachment.id)}
                >
                  삭제
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default MediaActions
