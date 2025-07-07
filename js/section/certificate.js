/**
 * 인증서 섹션 스크립트
 */

// 인증서 섹션 초기화
function initCertificateSection() {
  console.log("[Section] certificate section initialized");

  // 인증서 섹션 요소 찾기
  const certificateSections = document.querySelectorAll(".certificate");

  certificateSections.forEach((certificate) => {
    // 인증서 아이템
    const items = certificate.querySelectorAll(".certificate-item");

    // 이미지 갤러리 기능
    items.forEach((item) => {
      item.addEventListener("click", () => {
        // 모달 생성
        const modal = document.createElement("div");
        modal.className = "certificate-modal";

        // 이미지 클론
        const img = item.querySelector("img");
        const imgClone = img.cloneNode(true);
        imgClone.className = "certificate-modal-img";

        // 인증서 정보
        const info = item.querySelector(".certificate-info");
        const infoClone = info ? info.cloneNode(true) : null;

        // 닫기 버튼
        const closeBtn = document.createElement("div");
        closeBtn.className = "certificate-modal-close";
        closeBtn.innerHTML = "&times;";

        // 모달 구성
        modal.appendChild(closeBtn);
        modal.appendChild(imgClone);
        if (infoClone) {
          modal.appendChild(infoClone);
        }

        // 문서에 모달 추가
        document.body.appendChild(modal);

        // 스크롤 비활성화
        document.body.style.overflow = "hidden";

        // 닫기 이벤트
        closeBtn.addEventListener("click", () => {
          document.body.removeChild(modal);
          document.body.style.overflow = "";
        });

        // 모달 외부 클릭 시 닫기
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = "";
          }
        });
      });
    });

    // 필터 기능 (있는 경우)
    const filterButtons = certificate.querySelectorAll(
      ".certificate-filter button"
    );

    if (filterButtons.length > 0) {
      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          // 모든 버튼 비활성화
          filterButtons.forEach((btn) => {
            btn.classList.remove("active");
          });

          // 클릭한 버튼 활성화
          button.classList.add("active");

          // 필터 적용
          const filter = button.getAttribute("data-filter");

          items.forEach((item) => {
            if (filter === "all") {
              item.style.display = "";
            } else {
              const itemCategory = item.getAttribute("data-category");
              item.style.display = itemCategory === filter ? "" : "none";
            }
          });
        });
      });
    }
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initCertificateSection);

// 외부에서 접근 가능하도록 노출
window.initCertificateSection = initCertificateSection;

// Certificate Swiper 모듈 (네이밍 충돌 방지)
const CertificateSwiper = {
  instance: null,

  // 인증서 스와이퍼 초기화
  init: function () {
    console.log("[CertificateSwiper] Initialization started");

    // 기존 인스턴스가 있으면 제거
    if (this.instance) {
      this.instance.destroy(true, true);
      console.log("[CertificateSwiper] reset instance removed");
    }

    // certificate-swiper 요소 확인
    const swiperElement = document.querySelector(".certificate-swiper");
    if (!swiperElement) {
      console.log("[CertificateSwiper] .certificate-swiper element not found");
      return;
    }

    try {
      // CSS 변수로 scale 값 설정
      const scaleValue = this.getControlValue("scale", 1);
      document.documentElement.style.setProperty(
        "--certificate-scale",
        scaleValue
      );

      this.instance = new Swiper(".certificate-swiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        coverflowEffect: {
          rotate: this.getControlValue("rotate", 50),
          stretch: this.getControlValue("stretch", 0),
          depth: this.getControlValue("depth", 100),
          modifier: this.getControlValue("modifier", 1),
          slideShadows: this.getControlValue("slideShadows", true),
        },
        initialSlide: 2,
        speed: 600,
        spaceBetween: 30,
        pagination: {
          el: ".certificate-swiper .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".certificate-swiper .swiper-button-next",
          prevEl: ".certificate-swiper .swiper-button-prev",
        },
        keyboard: {
          enabled: true,
        },
        mousewheel: {
          thresholdDelta: 70,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });

      console.log("[CertificateSwiper] initialization completed");
    } catch (error) {
      console.error("[CertificateSwiper] initialization failed:", error);
    }
  },

  // 컨트롤 값 가져오기 (안전한 방식)
  getControlValue: function (id, defaultValue) {
    const element = document.getElementById(id);
    if (!element) return defaultValue;

    if (element.type === "checkbox") {
      return element.checked;
    } else if (element.type === "number") {
      return parseFloat(element.value) || defaultValue;
    }
    return element.value || defaultValue;
  },

  // 컨트롤 이벤트 리스너 설정
  setupControls: function () {
    const controls = [
      "depth",
      "modifier",
      "rotate",
      "scale",
      "stretch",
      "slideShadows",
    ];

    controls.forEach((controlId) => {
      const element = document.getElementById(controlId);
      if (element) {
        element.addEventListener("input", () => {
          console.log(`[CertificateSwiper] ${controlId} value changed`);
          this.init(); // 재초기화
        });
      }
    });
  },

  // 키보드 이벤트 설정
  setupKeyboardEvents: function () {
    document.addEventListener("keydown", (e) => {
      if (!this.instance) return;

      // 인증서 스와이퍼가 활성화된 상태에서만 동작
      const certificateSection = document.querySelector(".section-certificate");
      if (!certificateSection || !this.isElementInViewport(certificateSection))
        return;

      if (e.key === "ArrowLeft") {
        this.instance.slidePrev();
      } else if (e.key === "ArrowRight") {
        this.instance.slideNext();
      } else if (e.key === " ") {
        e.preventDefault();
        if (this.instance.autoplay.running) {
          this.instance.autoplay.stop();
        } else {
          this.instance.autoplay.start();
        }
      }
    });
  },

  // 마우스 이벤트 설정
  setupMouseEvents: function () {
    const container = document.querySelector(".certificate-swiper");
    if (container) {
      container.addEventListener("mouseenter", () => {
        if (this.instance && this.instance.autoplay) {
          this.instance.autoplay.stop();
        }
      });

      container.addEventListener("mouseleave", () => {
        if (this.instance && this.instance.autoplay) {
          this.instance.autoplay.start();
        }
      });
    }
  },

  // 요소가 뷰포트에 있는지 확인
  isElementInViewport: function (el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // 전체 초기화
  initAll: function () {
    this.init();
    this.setupControls();
    this.setupKeyboardEvents();
    this.setupMouseEvents();
  },
};

// DOM 로드 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  console.log("[CertificateSwiper] DOMContentLoaded event occurred");
  initSwiperWithRetry();
});

// 페이지 가시성 변경 시에도 초기화 시도
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    setTimeout(() => {
      if (
        document.querySelector(".certificate-swiper") &&
        !CertificateSwiper.instance
      ) {
        console.log("[CertificateSwiper] page focus, reinitialization attempt");
        initSwiperWithRetry();
      }
    }, 500);
  }
});

// 안전한 초기화 함수
function initSwiperWithRetry(retries = 5) {
  console.log(
    `[CertificateSwiper] initialization attempt (remaining: ${retries})`
  );

  // Swiper 라이브러리 확인
  if (!window.Swiper) {
    console.log("[CertificateSwiper] Swiper library waiting...");
    if (retries > 0) {
      setTimeout(() => initSwiperWithRetry(retries - 1), 200);
    } else {
      console.error("[CertificateSwiper] Swiper library loading failed");
    }
    return;
  }

  // DOM 요소 확인
  const swiperElement = document.querySelector(".certificate-swiper");
  if (!swiperElement) {
    console.log("[CertificateSwiper] DOM element waiting...");
    if (retries > 0) {
      setTimeout(() => initSwiperWithRetry(retries - 1), 200);
    } else {
      console.error("[CertificateSwiper] DOM element not found");
    }
    return;
  }

  // 슬라이드 요소 확인
  const slides = swiperElement.querySelectorAll(".swiper-slide");
  if (slides.length === 0) {
    console.log("[CertificateSwiper] slide element waiting...");
    if (retries > 0) {
      setTimeout(() => initSwiperWithRetry(retries - 1), 200);
    } else {
      console.error("[CertificateSwiper] slide element not found");
    }
    return;
  }

  console.log(
    `[CertificateSwiper] all conditions met, initialization started (slides: ${slides.length})`
  );
  CertificateSwiper.initAll();
}

// 외부에서 접근 가능하도록 노출
window.CertificateSwiper = CertificateSwiper;
window.initSwiperWithRetry = initSwiperWithRetry;

// 탭 컨텐츠 로드 이벤트 리스너
document.addEventListener("tabContentLoaded", (event) => {
  const { contentPath } = event.detail || {};
  console.log("[CertificateSwiper] tab content loaded:", contentPath);

  if (contentPath && contentPath.includes("solution-01-dfas-pro")) {
    console.log(
      "[CertificateSwiper] DFAS Pro page detected, initialization started"
    );
    setTimeout(() => {
      initSwiperWithRetry();
    }, 300);
  }
});

// allComponentsLoaded 이벤트 리스너
document.addEventListener("allComponentsLoaded", () => {
  console.log("[CertificateSwiper] all components loaded");
  setTimeout(() => {
    if (
      document.querySelector(".certificate-swiper") &&
      !CertificateSwiper.instance
    ) {
      console.log(
        "[CertificateSwiper] allComponentsLoaded, initialization attempt"
      );
      initSwiperWithRetry();
    }
  }, 500);
});
