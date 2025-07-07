/**
 * 히어로 섹션 스크립트
 */

// 히어로 섹션 초기화
function initHeroSection() {
  console.log("[Section] hero section initialized");

  // 히어로 섹션 요소 찾기
  const heroSections = document.querySelectorAll(".hero");

  heroSections.forEach((hero) => {
    // 배경 이미지 패럴랙스 효과
    if (hero.hasAttribute("data-parallax")) {
      window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const parallaxSpeed = hero.getAttribute("data-parallax-speed") || 0.5;

        // 패럴랙스 효과 적용
        hero.style.backgroundPositionY = `calc(50% + ${
          scrollPosition * parallaxSpeed
        }px)`;
      });
    }

    // 텍스트 페이드인 애니메이션
    const textElements = hero.querySelectorAll(".fade-in");

    textElements.forEach((element, index) => {
      // 각 요소마다 딜레이 적용
      setTimeout(() => {
        element.classList.add("visible");
      }, 200 * index);
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initHeroSection);

// 외부에서 접근 가능하도록 노출
window.initHeroSection = initHeroSection;
