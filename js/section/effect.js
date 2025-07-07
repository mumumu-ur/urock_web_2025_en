/**
 * 효과 섹션 스크립트
 */

// 효과 섹션 초기화
function initEffectSection() {
  console.log("[Section] effect section initialized");

  // 효과 섹션 요소 찾기
  const effectSections = document.querySelectorAll(".effect");

  effectSections.forEach((effect) => {
    // 애니메이션 효과 요소
    const animItems = effect.querySelectorAll(".anim-item");

    // 스크롤 애니메이션
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 요소가 보이면 클래스 추가
            entry.target.classList.add("animated");

            // 애니메이션 완료 후 관찰 중단
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // 관찰 시작
    animItems.forEach((item) => {
      observer.observe(item);
    });

    // 카운터 애니메이션
    const counters = effect.querySelectorAll(".counter");

    counters.forEach((counter) => {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 카운터 애니메이션 시작
              const target = parseInt(counter.getAttribute("data-target"));
              const duration = 2000; // 2초 동안 애니메이션
              const interval = 50; // 50ms마다 업데이트
              const steps = duration / interval;
              const increment = target / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;

                if (current >= target) {
                  clearInterval(timer);
                  counter.textContent = target;
                } else {
                  counter.textContent = Math.floor(current);
                }
              }, interval);

              // 관찰 중단
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counterObserver.observe(counter);
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initEffectSection);

// 외부에서 접근 가능하도록 노출
window.initEffectSection = initEffectSection;
