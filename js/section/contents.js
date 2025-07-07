/**
 * 컨텐츠 섹션 스크립트
 */

// 컨텐츠 섹션 초기화
function initContentsSection() {
  console.log("[Section] contents section initialized");

  // 컨텐츠 섹션 요소 찾기
  const contentsSections = document.querySelectorAll(".contents");

  contentsSections.forEach((contents) => {
    // 스크롤 애니메이션
    if (contents.hasAttribute("data-scroll-reveal")) {
      // Intersection Observer 설정
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1, // 10% 이상 보이면 애니메이션 실행
        }
      );

      // 애니메이션 대상 요소 관찰
      const targets = contents.querySelectorAll(".reveal-target");
      targets.forEach((target) => {
        observer.observe(target);
      });
    }

    // 이미지 갤러리 기능
    const gallery = contents.querySelector(".gallery");
    if (gallery) {
      const images = gallery.querySelectorAll(".gallery-item");

      images.forEach((image) => {
        image.addEventListener("click", () => {
          // 클릭한 이미지를 확대해서 보여주는 기능
          const overlay = document.createElement("div");
          overlay.className = "gallery-overlay";

          const imgClone = image.querySelector("img").cloneNode(true);
          imgClone.className = "gallery-overlay-img";

          overlay.appendChild(imgClone);
          document.body.appendChild(overlay);

          // 오버레이 클릭 시 닫기
          overlay.addEventListener("click", () => {
            document.body.removeChild(overlay);
          });
        });
      });
    }
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initContentsSection);

// 외부에서 접근 가능하도록 노출
window.initContentsSection = initContentsSection;
