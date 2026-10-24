/* Tailwind CDN 설정 — 폰트·브랜드 컬러 (index.html에서 Tailwind CDN 바로 다음에 로드) */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Pretendard', 'sans-serif'],
            },
            colors: {
                brand: {
                    blue: '#2563EB',
                    navy: '#0f172a',
                    slate: '#1e293b',
                }
            }
        }
    }
};
