/**
 * 특징 섹션 스크립트
 */

// 특징 섹션 초기화
function initFeatureSection() {
  console.log("[Section] feature section initialized");

  // 특징 섹션 요소 찾기
  const featureSections = document.querySelectorAll(".feature");

  featureSections.forEach((feature) => {
    // 특징 아이템 요소
    const items = feature.querySelectorAll(".frame");

    // 스크롤 애니메이션
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // 일정 시간 후 완전히 보이게 함
            setTimeout(() => {
              entry.target.classList.add("fully-visible");
            }, 300);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // 각 아이템 관찰 시작
    items.forEach((item) => {
      observer.observe(item);
    });

    // 호버 효과
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        // 호버된 아이템에 효과 적용
        item.classList.add("hovered");
      });

      item.addEventListener("mouseleave", () => {
        // 효과 제거
        item.classList.remove("hovered");
      });

      // 클릭 이벤트 (필요한 경우)
      item.addEventListener("click", () => {
        const link = item.getAttribute("data-link");
        if (link) {
          window.location.href = link;
        }
      });
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initFeatureSection);

// 외부에서 접근 가능하도록 노출
window.initFeatureSection = initFeatureSection;
