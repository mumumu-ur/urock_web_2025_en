// intro data definition (title, desc is set in HTML with data-*, breadcrumb is set in JS)
window.introData = {
  breadcrumb: ["Home", "Service", "M-SecuManager S"],
};

// Google Maps 관련 인터랙션 (반응형 대응)
const location = document.querySelector(".location-group");
const mapArea = document.querySelector(".map-area iframe");

// 요소가 존재하는지 확인
if (location && mapArea) {
  // 모바일 터치 이벤트와 데스크톱 마우스 이벤트 모두 지원
  const hideLocationGroup = () => {
    location.style.opacity = "0";
  };

  // 데스크톱: 마우스 이벤트
  mapArea.addEventListener("mousedown", hideLocationGroup);

  // 모바일: 터치 이벤트
  mapArea.addEventListener("touchstart", hideLocationGroup, { passive: true });

  // 페이지 로드/새로고침 시 location-group 활성화
  window.addEventListener("load", () => {
    location.style.opacity = "1";
  });

  // 모바일에서 지도 상호작용 개선
  if (window.innerWidth <= 768) {
    mapArea.style.pointerEvents = "auto";

    // 터치 시작 시 location-group 숨김
    mapArea.addEventListener(
      "touchmove",
      () => {
        location.style.opacity = "0";
      },
      { passive: true }
    );
  }
}

// txt-show: 뷰포트 진입/이탈 시 show 클래스 토글 (반응형 대응)
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: window.innerWidth <= 768 ? 0.05 : 0.1, // 모바일에서는 더 빠른 트리거
};

const txtShowObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      // 모바일에서는 한번 보이면 계속 보이도록 설정
      if (window.innerWidth > 768) {
        entry.target.classList.remove("show");
      }
    }
  });
}, observerOptions);

// txt-show observer 적용
const textShows = document.querySelectorAll(".txt-show");
textShows.forEach((textShow) => txtShowObserver.observe(textShow));

// 반응형 대응: 화면 크기 변경 시 observer 재설정
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // observer 재생성
    txtShowObserver.disconnect();

    const newObserverOptions = {
      root: null,
      rootMargin: "0px",
      threshold: window.innerWidth <= 768 ? 0.05 : 0.1,
    };

    const newTxtShowObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          if (window.innerWidth > 768) {
            entry.target.classList.remove("show");
          }
        }
      });
    }, newObserverOptions);

    // txt-show observer 재적용
    textShows.forEach((textShow) => newTxtShowObserver.observe(textShow));
  }, 250);
});

// 솔루션 문의 버튼 이벤트 (반응형 대응)
document.addEventListener("DOMContentLoaded", function () {
  const solutionBtn = document.querySelector(".btn-solution");

  if (solutionBtn) {
    solutionBtn.addEventListener("click", function () {
      // 모바일에서 햅틱 피드백 (지원되는 경우)
      if (navigator.vibrate && window.innerWidth <= 768) {
        navigator.vibrate(50);
      }

      // 문의 폼으로 이동 또는 모달 열기 등의 기능 구현
      console.log("solution inquiry button clicked");

      // 예시: 문의 페이지로 이동
      // window.location.href = '/contact';

      // 예시: 이메일 링크
      // window.location.href = 'mailto:contact@urock.co.kr?subject=solution inquiry';
    });

    // 모바일에서 터치 피드백
    if (window.innerWidth <= 768) {
      solutionBtn.addEventListener(
        "touchstart",
        function () {
          this.style.transform = "scale(0.98)";
        },
        { passive: true }
      );

      solutionBtn.addEventListener(
        "touchend",
        function () {
          this.style.transform = "scale(1)";
        },
        { passive: true }
      );
    }
  }
});
