# 이용상 | Con-Tech Engineer Portfolio

건축시공 엔지니어 포트폴리오 정적 사이트 (GitHub → Vercel 자동 배포)

- 사이트: https://portfolio-sable-psi-t37gokts42.vercel.app
- 연계 플랫폼: https://precent.vercel.app

## 폴더 구조

```
portfolio-site/
├── index.html              화면 문구·섹션 (소개·학력·역량·경력·프로젝트·분석)
├── css/
│   └── style.css           공통 스타일 (스크롤바, 애니메이션)
├── js/
│   ├── tailwind-config.js  폰트·브랜드 컬러 설정
│   ├── data.js             ★ 경력 기간 · 연락처 · 사진첩 ID
│   └── main.js             화면 동작 (메뉴, 슬라이더, 사진첩, 모달, 총 경력 계산)
├── vercel.json             Vercel 배포 설정
└── README.md
```

## 업로드(배포) 방법 — GitHub 웹

1. 압축을 풀고 `portfolio-site` 폴더를 엽니다.
2. GitHub 포트폴리오 저장소 → **Add file → Upload files**
3. `portfolio-site` 폴더 **안의 내용물 전체**(index.html, css, js, vercel.json, README.md)를 선택해 업로드 창에 끌어다 놓습니다.
   - 폴더째(`portfolio-site`) 올리면 저장소 안에 하위 폴더가 생겨 사이트가 열리지 않습니다.
   - 같은 이름의 파일은 덮어쓰고, 저장소에 있던 다른 파일은 그대로 남습니다.
4. **Commit changes** → Vercel이 자동 배포 (1~2분)
5. 사이트에서 새로고침(모바일은 캐시 때문에 시크릿 창 권장)으로 반영 확인

## 자주 수정하는 곳

| 수정 내용 | 파일 | 위치 |
|---|---|---|
| 입사·퇴사일, 총 경력 | `js/data.js` | `careerPeriods` — 총 경력은 자동 계산 (현 재직사는 `end: null`) |
| 이메일·전화·GitHub | `js/data.js` | `contact` — `github`이 비어 있으면 버튼 숨김 |
| 현장 사진첩 사진 | `js/data.js` | `galleries` — imgur ID 추가·삭제 |
| 프로젝트 대표 슬라이드 | `index.html` | `id="track-프로젝트ID"` 안 `<img>` 줄 추가·삭제 (점 개수 자동) |
| 문구·프로젝트 설명 | `index.html` | 각 섹션 |

## imgur 이미지 ID 찾는 법

`https://i.imgur.com/37DsoLa.jpeg` → ID는 `37DsoLa`
