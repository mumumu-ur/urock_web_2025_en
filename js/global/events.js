// 공통 이벤트 핸들러 (ex. window resize, scroll 등)

// 공통 이벤트 리스너 정의 파일

/**
 * 스크롤이 일정 이상 내려가면 버튼 보이기 (예: top 버튼)
 * @param {string} selector - 감지할 요소의 선택자 (예: '#backToTop')
 * @param {number} threshold - 얼마나 스크롤해야 버튼을 보여줄지 (픽셀)
 */
export function toggleScrollButton(selector, threshold = 100) {
  const button = document.querySelector(selector);

  if (!button) return;

  window.addEventListener("scroll", () => {
    // 페이지 Y스크롤 위치가 기준보다 크면 버튼 보이기
    if (window.scrollY > threshold) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });
}

/**
 * 윈도우 리사이즈될 때 콜백 실행
 * @param {Function} callback - 실행할 함수
 */
export function onWindowResize(callback) {
  window.addEventListener("resize", callback);
}
