// FAB 버튼 스크롤 동작 (모든 페이지에서 한 번만 동작)
document.addEventListener("DOMContentLoaded", function () {
  const fabBtn = document.querySelector(".fab-btn");

  if (fabBtn) {
    // 스크롤 위치에 따라 버튼 표시/숨김
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        fabBtn.style.display = "block";
      } else {
        fabBtn.style.display = "none";
      }
    });

    // 버튼 클릭 시 최상단으로 스크롤
    fabBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // 페이지 진입 시 초기 상태 설정
    if (window.scrollY > 300) {
      fabBtn.style.display = "block";
    } else {
      fabBtn.style.display = "none";
    }
  } else {
    console.log("[FAB] FAB button not found");
  }
});
