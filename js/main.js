/* =========================================================
 * 이용상 포트폴리오 - 화면 동작 스크립트
 * 데이터(경력 기간·연락처·사진 ID)는 js/data.js 에서 수정
 *
 *  1. 총 경력 자동 계산
 *  2. 모바일 메뉴
 *  3. 현장 사진첩 썸네일 생성
 *  4. 대표 이미지 슬라이더 (점 개수 자동, 스와이프 지원)
 *  5. 이미지 확대 모달 / 사진첩 넘기기
 *  6. 상세 성과 펼치기
 *  7. 연락처 모달 / GitHub 링크
 *  8. 공통 유틸 (스와이프, 키보드)
 * ========================================================= */


/* ---------------------------------------------------------
 * 1. 총 경력 자동 계산
 *    회사별 재직 기간(종료일 포함)을 합산해 'N년 M개월'로 표시
 *    표시 위치: data-career-total 속성이 있는 요소
 * --------------------------------------------------------- */
function toDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function calcCareer(today = new Date()) {
    let months = 0;
    let days = 0;

    PORTFOLIO.careerPeriods.forEach(({ start, end }) => {
        const s = toDate(start);
        const e = end ? toDate(end) : today;
        let m = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
        let d = e.getDate() - s.getDate() + 1;
        if (d < 0) {
            m -= 1;
            d += new Date(e.getFullYear(), e.getMonth(), 0).getDate();
        }
        months += m;
        days += d;
    });

    months += Math.floor(days / 30.4);
    return `${Math.floor(months / 12)}년 ${months % 12}개월`;
}

function renderCareerTotal() {
    const total = calcCareer();
    document.querySelectorAll('[data-career-total]').forEach(el => { el.textContent = total; });
}


/* ---------------------------------------------------------
 * 2. 모바일 메뉴 (768px 미만에서 햄버거 버튼으로 열고 닫음)
 * --------------------------------------------------------- */
function toggleMenu(force) {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    const btn = document.getElementById('menuBtn');
    if (!menu) return;

    const open = typeof force === 'boolean' ? force : menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !open);
    icon.classList.toggle('fa-bars', !open);
    icon.classList.toggle('fa-times', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
}

function initMobileMenu() {
    document.querySelectorAll('#mobileMenu a').forEach(a => {
        a.addEventListener('click', () => toggleMenu(false));
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) toggleMenu(false);
    });
}


/* ---------------------------------------------------------
 * 3. 현장 사진첩 썸네일 생성
 *    썸네일은 imgur 축소본(ID + 'l'), 확대 시 원본 로드
 * --------------------------------------------------------- */
function renderGalleries() {
    Object.keys(PORTFOLIO.galleries).forEach(siteId => {
        const container = document.getElementById(`gallery-${siteId}`);
        if (!container) return;

        container.innerHTML = PORTFOLIO.galleries[siteId].map((imgId, index) => `
            <div class="relative aspect-square overflow-hidden rounded-xl bg-slate-100 border border-slate-200 group cursor-pointer" onclick="openGallery('${siteId}', ${index})">
                <img src="https://i.imgur.com/${imgId}l.jpeg" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="현장 사진 ${index + 1}">
                <div class="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/20 transition-colors duration-300 flex items-center justify-center">
                    <i class="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 text-2xl"></i>
                </div>
            </div>
        `).join('');
    });
}


/* ---------------------------------------------------------
 * 4. 대표 이미지 슬라이더
 *    id="track-프로젝트ID" 안의 <img> 개수를 세어 점(dot)을 자동 생성
 *    → 이미지 추가·삭제 시 <img> 줄만 바꾸면 됨
 * --------------------------------------------------------- */
const sliders = {};

function initSliders() {
    document.querySelectorAll('[id^="track-"]').forEach(track => {
        const id = track.id.replace('track-', '');
        const total = track.children.length;
        sliders[id] = { current: 0, total };

        const dots = document.querySelector(`[data-dots="${id}"]`);
        if (dots) {
            dots.innerHTML = Array.from({ length: total }, (_, i) =>
                `<div class="w-2 h-2 rounded-full ${i === 0 ? 'bg-slate-800' : 'bg-slate-400'} transition-colors shadow-sm" id="dot-${id}-${i}"></div>`
            ).join('');
        }

        const box = document.getElementById(`slider-${id}`);
        if (!box) return;
        if (total <= 1) {
            box.querySelectorAll('button').forEach(b => b.classList.add('hidden'));
            if (dots) dots.classList.add('hidden');
            return;
        }
        addSwipe(box, dir => moveSlide(id, dir));
    });
}

function moveSlide(id, dir) {
    const slider = sliders[id];
    if (!slider || slider.total === 0) return;

    slider.current = (slider.current + dir + slider.total) % slider.total;
    document.getElementById(`track-${id}`).style.transform = `translateX(-${slider.current * 100}%)`;

    for (let i = 0; i < slider.total; i++) {
        const dot = document.getElementById(`dot-${id}-${i}`);
        if (!dot) continue;
        dot.classList.toggle('bg-slate-800', i === slider.current);
        dot.classList.toggle('bg-slate-400', i !== slider.current);
    }
}


/* ---------------------------------------------------------
 * 5. 이미지 확대 모달 / 사진첩 넘기기
 * --------------------------------------------------------- */
let currentGallery = null;
let currentIndex = 0;

function showImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// 단일 이미지 (재학증명서·자격증 등)
function openModal(imageSrc) {
    currentGallery = null;
    document.getElementById('modalImage').src = imageSrc;
    ['prevBtn', 'nextBtn', 'galleryCounter'].forEach(id => document.getElementById(id).classList.add('hidden'));
    showImageModal();
}

// 사진첩 (좌우 넘기기)
function openGallery(siteId, index) {
    currentGallery = PORTFOLIO.galleries[siteId];
    if (!currentGallery) return;
    currentIndex = index;
    document.getElementById('modalImage').src = `https://i.imgur.com/${currentGallery[currentIndex]}.jpeg`;
    ['prevBtn', 'nextBtn', 'galleryCounter'].forEach(id => document.getElementById(id).classList.remove('hidden'));
    updateCounter();
    showImageModal();
}

function navigateGallery(dir, event) {
    if (event) event.stopPropagation();
    if (!currentGallery) return;

    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    document.getElementById('modalImage').src = `https://i.imgur.com/${currentGallery[currentIndex]}.jpeg`;
    updateCounter();
}

function updateCounter() {
    document.getElementById('galleryCounter').innerText = `${currentIndex + 1} / ${currentGallery.length}`;
}

function closeModal(event) {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.getElementById('closeBtn');

    if (!event || event.target === modal || (event.currentTarget && event.currentTarget === closeBtn)) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';

        setTimeout(() => {
            if (modal.classList.contains('hidden')) {
                document.getElementById('modalImage').src = '';
            }
        }, 200);
    }
}

function initModalSwipe() {
    const modal = document.getElementById('imageModal');
    if (modal) addSwipe(modal, dir => navigateGallery(dir));
}


/* ---------------------------------------------------------
 * 6. 상세 성과 펼치기
 * --------------------------------------------------------- */
function toggleDetails(id) {
    const details = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    const willOpen = details.classList.contains('hidden');

    details.classList.toggle('hidden', !willOpen);
    if (icon) icon.classList.toggle('rotate-180', willOpen);
}


/* ---------------------------------------------------------
 * 7. 연락처 모달 / GitHub 링크
 * --------------------------------------------------------- */
function showContact(type) {
    const modal = document.getElementById('contactModal');
    const icon = document.getElementById('contactIcon');
    const title = document.getElementById('contactTitle');
    const text = document.getElementById('contactText');
    const content = document.getElementById('contactModalContent');

    if (type === 'email') {
        icon.innerHTML = '<i class="fas fa-envelope text-2xl"></i>';
        title.innerText = '이메일 주소';
        text.innerText = PORTFOLIO.contact.email;
    } else if (type === 'phone') {
        icon.innerHTML = '<i class="fas fa-phone text-2xl"></i>';
        title.innerText = '연락처';
        text.innerText = PORTFOLIO.contact.phone;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    }, 10);
}

function closeContactModal(event) {
    const modal = document.getElementById('contactModal');
    const content = document.getElementById('contactModalContent');

    if (!event || event.target === modal || event.currentTarget.tagName === 'BUTTON') {
        content.classList.remove('scale-100');
        content.classList.add('scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }, 200);
    }
}

// data.js 의 github 값이 비어 있으면 버튼 숨김
function initGithubLink() {
    const link = document.getElementById('githubLink');
    if (!link) return;
    if (PORTFOLIO.contact.github) {
        link.href = PORTFOLIO.contact.github;
    } else {
        link.remove();
    }
}


/* ---------------------------------------------------------
 * 8. 공통 유틸
 * --------------------------------------------------------- */

// 좌우 스와이프 감지 (40px 이상, 가로 이동이 세로보다 클 때)
function addSwipe(el, onSwipe) {
    let x0 = null;
    let y0 = null;

    el.addEventListener('touchstart', e => {
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
    }, { passive: true });

    el.addEventListener('touchend', e => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        const dy = e.changedTouches[0].clientY - y0;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) onSwipe(dx < 0 ? 1 : -1);
        x0 = null;
        y0 = null;
    }, { passive: true });
}

// 키보드: Esc 닫기, ←/→ 사진첩 넘기기
document.addEventListener('keydown', event => {
    const imageModal = document.getElementById('imageModal');
    const contactModal = document.getElementById('contactModal');

    if (!imageModal.classList.contains('hidden')) {
        if (event.key === 'Escape') closeModal();
        if (event.key === 'ArrowLeft') navigateGallery(-1);
        if (event.key === 'ArrowRight') navigateGallery(1);
    }
    if (event.key === 'Escape') {
        if (!contactModal.classList.contains('hidden')) closeContactModal();
        toggleMenu(false);
    }
});


/* ---------------------------------------------------------
 * 초기화
 * --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    renderCareerTotal();
    initMobileMenu();
    renderGalleries();
    initSliders();
    initModalSwipe();
    initGithubLink();
});
