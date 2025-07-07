/**
 * 제목 컴포넌트 스크립트
 */

// 제목 컴포넌트 초기화
function initTitleComponents() {
  console.log("[Component] title component initialization");

  // 타이틀 그룹 스타일링
  const titleGroups = document.querySelectorAll(".tit-group");

  titleGroups.forEach((group) => {
    // 타이틀 점 애니메이션 처리
    const dots = group.querySelectorAll(".tit-dot-child");

    dots.forEach((dot) => {
      // 선택적 애니메이션 적용
      if (group.hasAttribute("data-animate")) {
        dot.style.animation = "dotPulse 2s infinite";
      }
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initTitleComponents);

// 외부에서 접근 가능하도록 노출
window.initTitleComponents = initTitleComponents;
