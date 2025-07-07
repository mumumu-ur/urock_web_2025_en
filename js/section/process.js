/**
 * 프로세스 섹션 스크립트
 */

// 프로세스 섹션 초기화
function initProcessSection() {
  console.log("[Section] process section initialized");

  // 프로세스 섹션 요소 찾기
  const processSections = document.querySelectorAll(".process");

  processSections.forEach((process) => {
    // 프로세스 단계 요소
    const steps = process.querySelectorAll(".process-step");

    // 스크롤 시 단계별 애니메이션
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px", // 화면 하단 100px 전에 트리거
      }
    );

    // 각 단계 관찰 시작
    steps.forEach((step) => {
      observer.observe(step);
    });

    // 프로세스 단계 클릭 상호작용
    steps.forEach((step) => {
      step.addEventListener("click", () => {
        // 이미 활성화된 단계인 경우 상세 정보 토글
        if (step.classList.contains("active")) {
          const details = step.querySelector(".step-details");
          if (details) {
            details.classList.toggle("expanded");

            // 상세 정보가 확장된 경우 다른 단계의 상세 정보 접기
            if (details.classList.contains("expanded")) {
              steps.forEach((otherStep) => {
                if (otherStep !== step) {
                  const otherDetails = otherStep.querySelector(".step-details");
                  if (otherDetails) {
                    otherDetails.classList.remove("expanded");
                  }
                }
              });
            }
          }
        }
      });
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initProcessSection);

// 외부에서 접근 가능하도록 노출
window.initProcessSection = initProcessSection;
