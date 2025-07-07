/**
 * 설명 섹션 스크립트
 */

// 설명 섹션 초기화
function initDescriptionSection() {
  console.log("[Section] description section initialized");

  // 설명 섹션 요소 찾기
  const descriptionSections = document.querySelectorAll(".description");

  descriptionSections.forEach((description) => {
    // 텍스트 하이라이트 효과
    const highlights = description.querySelectorAll("[data-highlight]");

    highlights.forEach((highlight) => {
      // 하이라이트 효과 적용
      const text = highlight.textContent;
      const words = text.split(" ");

      // 텍스트를 단어별로 분리하여 스팬으로 감싸기
      highlight.innerHTML = words
        .map((word) => {
          return `<span class="highlighted-word">${word}</span>`;
        })
        .join(" ");

      // 스크롤 시 하이라이트 적용
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const words = entry.target.querySelectorAll(".highlighted-word");

              words.forEach((word, index) => {
                setTimeout(() => {
                  word.classList.add("active");
                }, 100 * index);
              });
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(highlight);
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initDescriptionSection);

// 외부에서 접근 가능하도록 노출
window.initDescriptionSection = initDescriptionSection;
