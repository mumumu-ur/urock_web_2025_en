/**
 * 활용 섹션 스크립트
 */

// 활용 섹션 초기화
function initUtilizationSection() {
  console.log("[Section] utilization section initialized");

  // 활용 섹션 요소 찾기
  const utilizationSections = document.querySelectorAll(".utilization");

  utilizationSections.forEach((utilization) => {
    // 활용 사례 요소
    const cases = utilization.querySelectorAll(".case-item");

    // 각 활용 사례에 상호작용 추가
    cases.forEach((caseItem) => {
      caseItem.addEventListener("mouseenter", () => {
        caseItem.classList.add("hovered");
      });

      caseItem.addEventListener("mouseleave", () => {
        caseItem.classList.remove("hovered");
      });

      // 클릭 시 상세 정보 표시
      caseItem.addEventListener("click", () => {
        // 모든 사례 비활성화
        cases.forEach((item) => {
          item.classList.remove("active");
        });

        // 클릭한 사례 활성화
        caseItem.classList.add("active");

        // 상세 정보 업데이트
        const detailsContainer = utilization.querySelector(".case-details");
        if (detailsContainer) {
          const caseId = caseItem.getAttribute("data-case-id");
          const detailsContent = utilization.querySelector(
            `.case-detail-content[data-case-id="${caseId}"]`
          );

          if (detailsContent) {
            // 모든 상세 내용 숨기기
            const allDetails = utilization.querySelectorAll(
              ".case-detail-content"
            );
            allDetails.forEach((detail) => {
              detail.classList.remove("visible");
            });

            // 선택한 상세 내용 표시
            detailsContent.classList.add("visible");

            // 상세 컨테이너가 숨겨져 있으면 표시
            detailsContainer.classList.add("visible");
          }
        }
      });
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initUtilizationSection);

// 외부에서 접근 가능하도록 노출
window.initUtilizationSection = initUtilizationSection;
