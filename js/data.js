/* =========================================================
 * 포트폴리오 데이터
 * 경력 기간·연락처·사진첩은 이 파일에서만 수정하면 화면에 자동 반영됩니다.
 * ========================================================= */
const PORTFOLIO = {

    /* 재직 기간 (YYYY-MM-DD)
     * end: null → 오늘 날짜까지 자동 계산 (현 재직사)
     * 총 경력 = 회사별 재직 기간 합산(공백 기간 제외, 종료일 포함) */
    careerPeriods: [
        { company: '샘코건설',             start: '2019-06-17', end: '2022-02-11' },
        { company: '에이스디엔시',         start: '2022-02-21', end: '2026-09-04' },
        { company: '아이파크현대산업개발', start: '2026-09-14', end: null }
    ],

    /* 연락처 (푸터 아이콘 클릭 시 표시)
     * github: 비워두면 GitHub 버튼이 숨겨집니다. 예) 'https://github.com/아이디' */
    contact: {
        email: 'fnffnvl94@naver.com',
        phone: '010-8739-4772',
        github: ''
    },

    /* 현장 사진첩 — imgur 이미지 ID (https://i.imgur.com/ID.jpeg 의 ID 부분)
     * 키 이름은 index.html의 id="gallery-키" 와 일치해야 합니다.
     * research = '연구계획서 보기' 버튼 이미지 */
    galleries: {
        boramae: ['D9rGR4n', 'dhsbpsf', 'TqP7aLv', 'uYjKVrO', 'ilkANZr', 'YMCTRlK', 'cZSySXc', '4ZlllB1', 'B4AIumW', 'EAbryfJ', 'GxcQ9zM', 'sKHMTsR', 'AVfvENb', 'EEdg5qL', '1LvMn3y', '6JfgXWv', 'pDjana6', 'aIKExGu', 'pDdYt08', '65sLgI7', 'r0d8dmX', 'Vzo5ITJ', 'ZZK4qDC', '7lELzKg', 'YvMx3LG', 'wVpnHFZ', '05SWp05', 'sbMCVdM'],
        ctower: ['W51zOdv', 'Lt4wSzA', 'LBE2gGu', '8fVtl9n', 's9OLIAl', 'KuBGam7', 'PdmfiSW', 'qRTBqiV', 'L1Wraw1', 'HeTUWFS', '6MIpnTb', '5VGL5xh', 'WhOZeFt', 'GJijsD8', 'JM34gQf', '0a6LtV9', '4Ls9ztR', 'fpnr7tO', 'JCcSiKk', 'cJCecLZ', 'tQSvvtC', '8c0FhRu', 'dnrTGIQ'],
        byeongjeom: ['EAgOPiI', 'g0iJwav', 'ZL8ndIf', 'GGT2VdP', 'zEsoGdo', '0Ff4dKm', 'xmggPrT', 'sh3rn6Y', 'dw7P4xp', 'kePkMvY', 'n2qeQ8Y', 'qLdvJDK', 'PPIX4Pk', 'ZRNQTyu', 'yYh8sJM', 'Tp0fjdx', 'kHyZWaF'],
        samseong: ['GWsvZdn', 'Zy68F2u', 'BE9zAmQ', 'SY4TaOi', 'YFZtUJr', 'H591MRe', 'Esu2D7A', 'cseYSlt', 'jpbX0Fi', '48Gqpv0', 'YNlzN8s', 'BzIURmd', 'V3EGcHC', 'MojRO8I', 'ZoUSIMj', 'IFyBRD5', '3p4CP53', 'HZxajWr', 'OhXG3cK', 'ghPdUiY', 'mEIRC5Y', '3T45wFS'],
        research: ['Tbwli2d', 'g7tUDBF', 'dYFmL70']
    }
};
