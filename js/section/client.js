/**
 * 클라이언트 섹션 스크립트
 */

// 클라이언트 섹션 초기화
function initClientSection() {
  console.log("[Section] client section initialized");

  // 클라이언트 섹션 요소 찾기
  const clientSections = document.querySelectorAll(".client");

  clientSections.forEach((client) => {
    // 로고 슬라이더 기능
    const logoWrapper = client.querySelector(".client-logo-wrapper");

    if (logoWrapper) {
      // 로고 애니메이션 효과 설정
      const logos = logoWrapper.querySelectorAll(
        ".client-logo-icon:not(.clone)"
      );

      // 로고 복제하여 무한 스크롤 효과 만들기
      logos.forEach((logo) => {
        const clone = logo.cloneNode(true);
        clone.classList.add("clone");
        logoWrapper.appendChild(clone);
      });

      // 로고 애니메이션 제어
      let animationPaused = false;

      // 호버 시 애니메이션 일시 정지
      logoWrapper.addEventListener("mouseenter", () => {
        animationPaused = true;
        logoWrapper.style.animationPlayState = "paused";
      });

      // 호버 해제 시 애니메이션 재개
      logoWrapper.addEventListener("mouseleave", () => {
        animationPaused = false;
        logoWrapper.style.animationPlayState = "running";
      });

      // 창 크기에 따른 애니메이션 속도 조절
      function adjustAnimation() {
        const wrapperWidth = logoWrapper.offsetWidth;
        const scrollWidth = logoWrapper.scrollWidth / 2; // 복제본 제외

        // 화면 크기에 따라 애니메이션 시간 조정
        const duration = Math.max(scrollWidth / 50, 10); // 최소 10초

        logoWrapper.style.animationDuration = `${duration}s`;
      }

      // 초기 애니메이션 설정
      adjustAnimation();

      // 창 크기 변경 시 애니메이션 조정
      window.addEventListener("resize", adjustAnimation);
    }
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initClientSection);

// 외부에서 접근 가능하도록 노출
window.initClientSection = initClientSection;
