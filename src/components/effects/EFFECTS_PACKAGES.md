# Effects Package Summary

`src/components/effects`에서 현재 사용/관련된 패키지 정리입니다.

## 터미널 설치 명령어
아래 명령어는 프로젝트 루트에서 실행합니다.

```bash
# effects 관련 패키지 한 번에 설치
npm install gsap @gsap/react chart.js react-chartjs-2 swiper
```

```bash
# 개별 설치
npm install gsap
npm install @gsap/react
npm install chart.js
npm install react-chartjs-2
npm install swiper
```

## 온보딩 영상 사전 설치
온보딩 영상 변환/압축 작업에는 로컬 환경에 `ffmpeg`가 필요합니다.
`ffmpeg`는 npm 패키지가 아니라 OS에 설치하는 시스템 도구입니다.

### macOS 또는 iOS 영상 작업 환경
Homebrew가 설치되어 있다면 아래 명령어로 설치합니다.

```bash
brew install ffmpeg
```

### Windows
Windows에서는 `ffmpeg`를 설치한 뒤 터미널에서 `ffmpeg` 명령어를 사용할 수 있도록 PATH에 등록합니다.

```bash
winget install Gyan.FFmpeg
```

설치 후 새 터미널을 열고 아래 명령어로 설치 여부를 확인합니다.

```bash
ffmpeg -version
```

## 업데이트 규칙
- 새 패키지를 설치할 때마다 이 파일에 즉시 추가합니다.
- 버전이 바뀌면 기존 항목의 버전도 함께 갱신합니다.
- 가능하면 `사용 파일`과 `용도`를 같이 기록합니다.

## Runtime Dependencies
- `gsap@^3.15.0`
  - 사용 파일: `text/TextType.tsx`
  - 용도: 커서 깜빡임 애니메이션

- `@gsap/react@^2.1.2`
  - 현재 effects 폴더 직접 사용 없음
  - 용도: React 환경 GSAP 연동용

- `chart.js@^4.5.1`
  - 사용 파일: `charts/DoughnutChart.tsx`, `charts/BarChart.tsx`, `charts/LineChart.tsx`
  - 용도: 차트 렌더링 엔진

- `react-chartjs-2@^5.3.1`
  - 사용 파일: `charts/DoughnutChart.tsx`, `charts/BarChart.tsx`, `charts/LineChart.tsx`
  - 용도: React용 Chart.js 래퍼 컴포넌트

- `swiper@^12.1.4`
  - 사용 파일: `swiper/CardSwiper.tsx`, `swiper/CoverFlow.tsx`
  - 용도: 스와이프 UI 효과

## 추가 설치 불필요 효과
- `stagger/SequentialHighlightList` (외부 패키지 추가 설치 없음)
  - 사용 파일: `stagger/SequentialHighlightList.tsx`, `stagger/SequentialHighlightList.css`
  - 용도: 항목이 시간차로 하나씩 강조되는 순차(스태거) 하이라이트 리스트

- `cards/FanDeck` (외부 패키지 추가 설치 없음)
  - 사용 파일: `cards/FanDeck.tsx`, `cards/FanDeck.css`
  - 용도: 겹쳐진 카드가 중앙 강조되며 순환되는 팬(Deck) 카드 효과
