import { useRef, useState, type ChangeEvent } from 'react'
import type { ReceiptAnalysisResult } from '../../features/ai/types/ai.types'
import {
  RECEIPT_IMAGE_MAX_DATA_URL_LENGTH,
  analyzeReceiptImage,
} from '../../features/ai/services/receiptApi'
import receiptMascotImage from '../../components/chatbot/images/chatbot .png'
import cameraIcon from '../../components/chatbot/images/chat_camera.png'
import galleryIcon from '../../components/chatbot/images/gall.png'
import './ReceiptAnalysis.css'

type UploadSource = 'camera' | 'album'

const MAX_RECEIPT_IMAGE_FILE_SIZE = 20_000_000
const IMAGE_EDGE_CANDIDATES = [1400, 1200, 1000, 900, 800, 700, 600]
const JPEG_QUALITY_CANDIDATES = [0.84, 0.72, 0.62, 0.52, 0.44]

const CATEGORY_LABELS: Record<NonNullable<ReceiptAnalysisResult['items'][number]['category']>, string> = {
  vegetable: '채소',
  meat: '육류',
  seafood: '해산물',
  dairy: '유제품',
  grain: '곡물',
  snack: '간식',
  drink: '음료',
  etc: '기타',
}

function formatWon(value: number | undefined) {
  if (typeof value !== 'number') return '확인 어려움'
  return `${new Intl.NumberFormat('ko-KR').format(value)}원`
}

function formatMeta(value: string | undefined) {
  return value && value !== '확인 어려움' ? value : '확인 어려움'
}

function loadImageFromUrl(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('영수증 미리보기를 불러오지 못했어요.'))
    image.src = url
  })
}

function renderImageToCanvas(
  image: HTMLImageElement,
  maxEdge: number,
) {
  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height
  const ratio = Math.min(1, maxEdge / Math.max(width, height))
  const targetWidth = Math.max(1, Math.round(width * ratio))
  const targetHeight = Math.max(1, Math.round(height * ratio))
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('이미지를 압축하지 못했어요. 다시 시도해주세요.')
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight)
  return canvas
}

function encodeCanvasToJpegWithinLimit(canvas: HTMLCanvasElement) {
  let fallback = ''

  for (const quality of JPEG_QUALITY_CANDIDATES) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality)
    if (!dataUrl.startsWith('data:image/jpeg')) continue
    fallback = dataUrl
    if (dataUrl.length <= RECEIPT_IMAGE_MAX_DATA_URL_LENGTH) {
      return dataUrl
    }
  }

  return fallback
}

async function convertReceiptImageToDataUrl(file: File) {
  if (file.size > MAX_RECEIPT_IMAGE_FILE_SIZE) {
    throw new Error('사진 파일이 너무 커요. 20MB 이하 이미지로 다시 시도해주세요.')
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImageFromUrl(objectUrl)

    for (const edge of IMAGE_EDGE_CANDIDATES) {
      const canvas = renderImageToCanvas(image, edge)
      const dataUrl = encodeCanvasToJpegWithinLimit(canvas)
      if (dataUrl && dataUrl.length <= RECEIPT_IMAGE_MAX_DATA_URL_LENGTH) {
        return dataUrl
      }
    }

    throw new Error('이미지가 너무 커요. 영수증을 조금 더 가까이 찍거나 낮은 해상도로 다시 시도해주세요.')
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function ReceiptAnalysis() {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const albumInputRef = useRef<HTMLInputElement>(null)
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [fileLabel, setFileLabel] = useState('')
  const [result, setResult] = useState<ReceiptAnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileChange = async (
    source: UploadSource,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    event.currentTarget.value = ''
    setErrorMessage('')
    setResult(null)

    try {
      const convertedImage = await convertReceiptImageToDataUrl(file)
      setImageDataUrl(convertedImage)
      setFileLabel(source === 'camera' ? '카메라로 촬영한 영수증' : file.name)
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : '영수증 사진을 처리하지 못했어요. 다시 시도해주세요.'
      setErrorMessage(message)
    }
  }

  const handleAnalyze = async () => {
    if (!imageDataUrl || isAnalyzing) return

    setIsAnalyzing(true)
    setErrorMessage('')
    setResult(null)

    try {
      const nextResult = await analyzeReceiptImage(imageDataUrl)
      setResult(nextResult)
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : '영수증을 더 밝게 찍어 다시 시도해주세요.'
      setErrorMessage(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setImageDataUrl('')
    setFileLabel('')
    setResult(null)
    setErrorMessage('')
    setIsAnalyzing(false)
  }

  const usableItems = result?.items.filter((item) => item.lunchboxUsable) ?? []

  return (
    <div className="app-shell">
      <div className="app-screen receipt-analysis-screen">
        <main className="receipt-analysis-page" aria-label="영수증 분석">
          <header className="receipt-analysis-header">
            <button
              className="receipt-analysis-header__back"
              type="button"
              aria-label="챗봇으로 돌아가기"
              onClick={() => { window.location.hash = '#/chatbot' }}
            >
              ‹
            </button>
            <div>
              <p className="receipt-analysis-header__eyebrow">AI 영수증 분석</p>
              <h1 className="receipt-analysis-header__title">오늘 산 재료로 도시락 만들기</h1>
            </div>
          </header>

          <section className="receipt-analysis-hero">
            <div className="receipt-analysis-hero__copy">
              <p className="receipt-analysis-hero__label">영수증 한 장이면 충분해요</p>
              <p className="receipt-analysis-hero__text">
                구매 품목과 지출을 읽고, 도시락에 바로 쓸 수 있는 재료와 절약 포인트를 정리해드릴게요.
              </p>
            </div>
            <img className="receipt-analysis-hero__mascot" src={receiptMascotImage} alt="" aria-hidden="true" />
          </section>

          <section className="receipt-upload-card">
            <div className="receipt-upload-card__header">
              <h2>영수증 사진 올리기</h2>
              <p>글자가 잘 보이도록 밝은 곳에서 영수증 전체가 나오게 찍어주세요.</p>
            </div>

            <div className="receipt-upload-actions" aria-label="영수증 사진 선택 방식">
              <button
                className="receipt-upload-actions__button"
                type="button"
                onClick={() => cameraInputRef.current?.click()}
              >
                <img src={cameraIcon} alt="" aria-hidden="true" />
                <span>카메라로 촬영</span>
              </button>
              <button
                className="receipt-upload-actions__button"
                type="button"
                onClick={() => albumInputRef.current?.click()}
              >
                <img src={galleryIcon} alt="" aria-hidden="true" />
                <span>앨범에서 선택</span>
              </button>
            </div>

            {imageDataUrl ? (
              <div className="receipt-preview">
                <img src={imageDataUrl} alt="선택한 영수증 미리보기" />
                <div className="receipt-preview__meta">
                  <strong>{fileLabel || '선택한 영수증'}</strong>
                  <span>이미지는 서버로 전송되기 전에 자동으로 압축돼요.</span>
                </div>
              </div>
            ) : (
              <div className="receipt-guide-card">
                <strong>예시로 이런 내용을 분석해요</strong>
                <span>마트 영수증, 편의점 구매 내역, 장보기 결제 내역</span>
                <span>잘 안 보이는 금액과 품목은 추측하지 않고 확인 어려움으로 표시해요.</span>
              </div>
            )}

            {errorMessage ? (
              <p className="receipt-analysis-error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="receipt-upload-card__footer">
              <button
                className="receipt-analysis-primary"
                type="button"
                disabled={!imageDataUrl || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? '분석 중...' : result ? '다시 분석하기' : '분석하기'}
              </button>
              {imageDataUrl ? (
                <button className="receipt-analysis-secondary" type="button" onClick={handleReset}>
                  새 영수증 선택
                </button>
              ) : null}
            </div>
          </section>

          {isAnalyzing ? (
            <section className="receipt-loading-card" aria-live="polite">
              <span className="receipt-loading-card__spinner" aria-hidden="true" />
              <h2>영수증을 읽고 있어요</h2>
              <p>품목, 금액, 도시락 활용 재료를 차근차근 정리하는 중이에요.</p>
            </section>
          ) : null}

          {result ? (
            <section className="receipt-result-list" aria-label="영수증 분석 결과">
              <article className="receipt-result-card receipt-result-card--total">
                <span className="receipt-result-card__label">총 지출 금액</span>
                <strong>{formatWon(result.totalAmount)}</strong>
                <p>{formatMeta(result.storeName)} · {formatMeta(result.purchasedAt)}</p>
              </article>

              <article className="receipt-result-card">
                <div className="receipt-result-card__title-row">
                  <h2>구매 품목 리스트</h2>
                  <span>{result.items.length}개</span>
                </div>
                <ul className="receipt-item-list">
                  {result.items.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.quantity ? `${item.quantity} · ` : ''}
                          {item.category ? CATEGORY_LABELS[item.category] : '분류 확인 어려움'}
                        </span>
                      </div>
                      <em>{formatWon(item.price)}</em>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="receipt-result-card">
                <h2>도시락 활용 가능 재료</h2>
                <div className="receipt-chip-list">
                  {(result.lunchboxIngredients.length > 0
                    ? result.lunchboxIngredients
                    : usableItems.map((item) => item.name)
                  ).map((item) => (
                    <span className="receipt-chip" key={item}>{item}</span>
                  ))}
                  {result.lunchboxIngredients.length === 0 && usableItems.length === 0 ? (
                    <span className="receipt-empty-text">확인 가능한 도시락 재료가 적어요.</span>
                  ) : null}
                </div>
              </article>

              <article className="receipt-result-card">
                <h2>절약 체크</h2>
                <ul className="receipt-tip-list">
                  {result.savingTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                  {result.savingTips.length === 0 ? (
                    <li>확인 가능한 절약 포인트가 적어요.</li>
                  ) : null}
                </ul>
              </article>

              <article className="receipt-result-card">
                <h2>추천 도시락 메뉴</h2>
                <div className="receipt-menu-list">
                  {result.recommendedMenus.map((menu) => (
                    <section className="receipt-menu-item" key={menu.name}>
                      <strong>{menu.name}</strong>
                      <p>{menu.reason}</p>
                      <div className="receipt-menu-item__ingredients">
                        {menu.ingredients.map((ingredient) => (
                          <span key={ingredient}>{ingredient}</span>
                        ))}
                      </div>
                    </section>
                  ))}
                  {result.recommendedMenus.length === 0 ? (
                    <p className="receipt-empty-text">추천 메뉴를 만들 만큼 읽힌 재료가 부족해요.</p>
                  ) : null}
                </div>
              </article>

              <article className="receipt-result-card receipt-result-card--next">
                <span className="receipt-result-card__label">다음 행동 제안</span>
                <p>{result.summary}</p>
                <strong>{result.nextAction}</strong>
              </article>
            </section>
          ) : null}

          <input
            ref={cameraInputRef}
            className="receipt-hidden-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => {
              void handleFileChange('camera', event)
            }}
          />
          <input
            ref={albumInputRef}
            className="receipt-hidden-input"
            type="file"
            accept="image/*"
            onChange={(event) => {
              void handleFileChange('album', event)
            }}
          />
        </main>
      </div>
    </div>
  )
}

export default ReceiptAnalysis
