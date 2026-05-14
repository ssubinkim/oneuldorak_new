import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import WriteTopIcon from './WriteTopIcon'
import type { CommunityMediaAttachment } from './writeTypes'
import './MediaActions.css'

const MAX_MEDIA_ATTACHMENT_COUNT = 5
const REMOVE_FEEDBACK_MS = 140

type MediaActionsProps = {
  value: CommunityMediaAttachment[]
  onChange: (value: CommunityMediaAttachment[]) => void
}

function createAttachmentId(kind: CommunityMediaAttachment['kind'], file: File) {
  return `${kind}-${Date.now()}-${file.name}-${file.size}`
}

function getAttachmentKind(file: File): CommunityMediaAttachment['kind'] {
  return file.type.startsWith('video/') ? 'video' : 'image'
}

function MediaActions({ value, onChange }: MediaActionsProps) {
  const mediaInputRef = useRef<HTMLInputElement | null>(null)
  const generatedPreviewUrlRef = useRef<Record<string, string>>({})
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [removingAttachmentIds, setRemovingAttachmentIds] = useState<string[]>([])
  const isMaxReached = value.length >= MAX_MEDIA_ATTACHMENT_COUNT

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

  const handleSelectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.currentTarget.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    const availableCount = Math.max(0, MAX_MEDIA_ATTACHMENT_COUNT - value.length)
    const nextAttachments = selectedFiles.slice(0, availableCount).map((file) => {
      const kind = getAttachmentKind(file)

      return {
        id: createAttachmentId(kind, file),
        kind,
        file,
        name: file.name,
        size: file.size,
      }
    })

    if (nextAttachments.length > 0) {
      onChange([...value, ...nextAttachments])
    }

    event.currentTarget.value = ''
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    if (removingAttachmentIds.includes(attachmentId)) {
      return
    }

    setRemovingAttachmentIds((ids) => [...ids, attachmentId])
    window.setTimeout(() => {
      onChange(value.filter((attachment) => attachment.id !== attachmentId))
      setRemovingAttachmentIds((ids) => ids.filter((id) => id !== attachmentId))
    }, REMOVE_FEEDBACK_MS)
  }

  return (
    <div className="community-write-media">
      <div className="community-write-media-header">
        <div className="community-write-media-title-group">
          <span className="community-write-media-label">사진 / 영상 추가</span>
          <span className="community-write-media-limit">(최대 5개 까지)</span>
        </div>
        <strong>{value.length} / {MAX_MEDIA_ATTACHMENT_COUNT}</strong>
      </div>

      <div className="community-write-media-strip">
        <button
          type="button"
          className="community-write-media-button"
          aria-label="사진 또는 동영상 추가"
          disabled={isMaxReached}
          onClick={() => mediaInputRef.current?.click()}
        >
          <WriteTopIcon kind="camera" />
        </button>

        {value.length > 0 && (
          <ul className="community-write-media-preview-list" aria-label="업로드한 미디어">
            {value.map((attachment) => {
              const previewUrl = previewUrls[attachment.id]
              const fileName = attachment.name ?? attachment.file?.name ?? '업로드한 미디어'

              return (
                <li
                  key={attachment.id}
                  className={[
                    'community-write-media-preview',
                    removingAttachmentIds.includes(attachment.id) ? 'is-removing' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <div className="community-write-media-preview__thumb">
                    {previewUrl ? (
                      attachment.kind === 'image' ? (
                        <img src={previewUrl} alt="" aria-hidden="true" />
                      ) : (
                        <video src={previewUrl} muted playsInline aria-hidden="true" />
                      )
                    ) : (
                      <span aria-hidden="true">{attachment.kind === 'image' ? 'IMG' : 'MOV'}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="community-write-media-preview__remove"
                    aria-label={`${fileName} 삭제`}
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    <WriteTopIcon kind="remove" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <input
        ref={mediaInputRef}
        className="community-write-media-input"
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleSelectFiles}
      />
    </div>
  )
}

export default MediaActions
