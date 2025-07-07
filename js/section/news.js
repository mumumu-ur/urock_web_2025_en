/**
 * 뉴스 섹션 스크립트
 */

// 뉴스 섹션 초기화
function initNewsSection() {
  console.log("[Section] news section initialized");

  // 뉴스 섹션 요소 찾기
  const newsSections = document.querySelectorAll(".news");

  newsSections.forEach((news) => {
    // 태그 필터 기능
    const tagButtons = news.querySelectorAll(".tag-container a");
    const cards = news.querySelectorAll(".card");

    tagButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();

        // 모든 버튼 비활성화
        tagButtons.forEach((btn) => {
          btn.classList.remove("active");
        });

        // 클릭한 버튼 활성화
        button.classList.add("active");

        // 태그 값 가져오기
        const tag = button.getAttribute("data-tag");

        // 카드 필터링
        cards.forEach((card) => {
          if (tag === "all") {
            card.style.display = "";
          } else {
            const cardTag = card.getAttribute("data-tag");
            card.style.display = cardTag === tag ? "" : "none";
          }
        });
      });
    });

    // 검색 기능
    const searchForm = news.querySelector(".search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const searchInput = searchForm.querySelector("input");
        const searchTerm = searchInput.value.toLowerCase();

        // 검색어로 카드 필터링
        cards.forEach((card) => {
          const title = card.querySelector("h4").textContent.toLowerCase();
          const content = card.querySelector("p").textContent.toLowerCase();

          if (title.includes(searchTerm) || content.includes(searchTerm)) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });

        // 태그 버튼 초기화
        tagButtons.forEach((btn) => {
          btn.classList.remove("active");
        });

        // '전체' 버튼 활성화
        const allButton = news.querySelector(
          '.tag-container a[data-tag="all"]'
        );
        if (allButton) {
          allButton.classList.add("active");
        }
      });
    }

    // 정렬 옵션
    const sortButtons = news.querySelectorAll(".options button");

    sortButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const sortBy = button.getAttribute("data-sort");
        const sortOrder = button.getAttribute("data-order");

        // 카드 배열 변환
        const cardsArray = Array.from(cards);

        // 정렬 함수
        cardsArray.sort((a, b) => {
          let valueA, valueB;

          if (sortBy === "date") {
            valueA = new Date(a.querySelector("time").getAttribute("datetime"));
            valueB = new Date(b.querySelector("time").getAttribute("datetime"));
          } else if (sortBy === "title") {
            valueA = a.querySelector("h4").textContent;
            valueB = b.querySelector("h4").textContent;
          }

          if (sortOrder === "asc") {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
        });

        // 정렬된 요소 재배치
        const container = news.querySelector(".cards");
        cardsArray.forEach((card) => {
          container.appendChild(card);
        });
      });
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initNewsSection);

// 외부에서 접근 가능하도록 노출
window.initNewsSection = initNewsSection;
