/**
 * 배너 컴포넌트 스크립트
 */

// 배너 컴포넌트 초기화
function initBannerComponents() {
  console.log("[Component] Banner component reset");

  // 배너 슬라이드 기능
  const banners = document.querySelectorAll(".banner");

  banners.forEach((banner) => {
    // 자동 슬라이드 설정
    if (banner.hasAttribute("data-auto-slide")) {
      const slides = banner.querySelectorAll(".slide");
      let currentSlide = 0;

      // 초기 슬라이드 표시
      slides[0].classList.add("active");

      // 슬라이드 인터벌 설정
      const interval = setInterval(() => {
        // 현재 슬라이드 비활성화
        slides[currentSlide].classList.remove("active");

        // 다음 슬라이드 인덱스 계산
        currentSlide = (currentSlide + 1) % slides.length;

        // 다음 슬라이드 활성화
        slides[currentSlide].classList.add("active");
      }, 5000); // 5초마다 슬라이드 변경

      // 페이지 이탈 시 인터벌 정리
      window.addEventListener("beforeunload", () => {
        clearInterval(interval);
      });
    }
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initBannerComponents);

// 외부에서 접근 가능하도록 노출
window.initBannerComponents = initBannerComponents;
