/**
 * Certificate Swiper 전용 초기화 모듈
 */

// Certificate Swiper CDN 동적 로딩 함수
async function loadCertificateSwiperLibrary() {
  // 이미 Swiper가 로드되어 있는지 확인
  if (window.Swiper) {
    return window.Swiper;
  }

  try {
    // 기존 스크립트 태그가 있는지 확인
    if (!document.querySelector('script[src*="swiper-bundle.min.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js";
      script.async = true;
      script.crossOrigin = "anonymous";

      // 헤드에 스크립트 추가
      document.head.appendChild(script);

      // 스크립트 로딩 완료까지 대기
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Failed to load Swiper script"));

        // 이미 로드되어 있을 경우를 위한 타이머
        setTimeout(() => {
          if (window.Swiper) resolve();
        }, 200);
      });
    }

    // Swiper 라이브러리 로딩 확인 (최대 5초 대기)
    for (let i = 0; i < 50; i++) {
      if (window.Swiper) {
        return window.Swiper;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error("Swiper loading timeout");
  } catch (error) {
    console.error("[CertificateSwiper] Library loading failed:", error);
    return null;
  }
}

// Certificate Swiper 초기화 함수
async function initCertificateSwiper() {
  try {
    // Swiper 라이브러리 로딩
    const SwiperClass = await loadCertificateSwiperLibrary();
    if (!SwiperClass) {
      return false;
    }

    // DOM 요소 확인
    const swiperElement = document.querySelector(".certificate-swiper");
    if (!swiperElement) {
      return false;
    }

    // 슬라이드 요소 확인
    const slides = swiperElement.querySelectorAll(".swiper-slide");
    if (slides.length === 0) {
      return false;
    }

    // 기존 인스턴스가 있으면 제거
    if (swiperElement.swiper) {
      swiperElement.swiper.destroy(true, true);
    }

    // Certificate Swiper 초기화
    const certificateSwiper = new SwiperClass(".certificate-swiper", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      loop: false,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      initialSlide: 0,
      speed: 600,
      spaceBetween: 30,
      slidesPerGroup: 1,
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
    });

    // 버튼 상태 업데이트 함수
    const updateButtonStates = () => {
      const nextBtn = document.querySelector(
        ".certificate-swiper .swiper-button-next"
      );
      const prevBtn = document.querySelector(
        ".certificate-swiper .swiper-button-prev"
      );
      const currentIndex = certificateSwiper.activeIndex;
      const totalSlides = certificateSwiper.slides.length;

      // 버튼 상태 업데이트
      if (prevBtn) {
        prevBtn.classList.toggle("swiper-button-disabled", currentIndex === 0);
      }
      if (nextBtn) {
        nextBtn.classList.toggle(
          "swiper-button-disabled",
          currentIndex === totalSlides - 1
        );
      }
    };

    // 슬라이드 변경 이벤트
    certificateSwiper.on("slideChange", updateButtonStates);

    // 초기 버튼 상태 설정
    updateButtonStates();

    // 전역 접근을 위해 저장
    window.certificateSwiperInstance = certificateSwiper;

    return true;
  } catch (error) {
    console.error("[CertificateSwiper] Initialization failed:", error);
    return false;
  }
}

// 안전한 초기화 함수
async function safeCertificateSwiperInit(retries = 3) {
  if (retries <= 0) return;

  try {
    const success = await initCertificateSwiper();
    if (!success) {
      setTimeout(() => safeCertificateSwiperInit(retries - 1), 1000);
    }
  } catch (error) {
    setTimeout(() => safeCertificateSwiperInit(retries - 1), 1000);
  }
}

// 이벤트 리스너 설정
if (typeof document !== "undefined") {
  // DOM 로드 완료 시
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(safeCertificateSwiperInit, 500);
  });

  // 페이지 완전 로드 완료 시
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (
        document.querySelector(".certificate-swiper") &&
        !window.certificateSwiperInstance
      ) {
        safeCertificateSwiperInit();
      }
    }, 500);
  });

  // 탭 컨텐츠 로드 시
  document.addEventListener("tabContentLoaded", (event) => {
    const { contentPath } = event.detail || {};
    if (contentPath && contentPath.includes("solution-")) {
      setTimeout(safeCertificateSwiperInit, 300);
    }
  });

  // 모든 컴포넌트 로드 완료 시
  document.addEventListener("allComponentsLoaded", () => {
    setTimeout(() => {
      if (
        document.querySelector(".certificate-swiper") &&
        !window.certificateSwiperInstance
      ) {
        safeCertificateSwiperInit();
      }
    }, 500);
  });
}

// 전역 함수로 노출
if (typeof window !== "undefined") {
  window.initCertificateSwiper = initCertificateSwiper;
  window.safeCertificateSwiperInit = safeCertificateSwiperInit;

  // 디버깅 함수들
  window.forceCertificateSwiper = () => safeCertificateSwiperInit();

  window.checkCertificateSwiper = () => {
    const instance = window.certificateSwiperInstance;
    if (instance) {
      console.log(
        "[CertificateSwiper] 현재:",
        instance.activeIndex + 1,
        "/",
        instance.slides.length
      );
      console.log("[CertificateSwiper] Loop:", instance.params.loop);
      console.log("[CertificateSwiper] 첫번째:", instance.activeIndex === 0);
      console.log(
        "[CertificateSwiper] 마지막:",
        instance.activeIndex === instance.slides.length - 1
      );
    } else {
      console.log("[CertificateSwiper] 인스턴스 없음");
    }
  };

  window.testCertificateSwiper = () => {
    const instance = window.certificateSwiperInstance;
    if (instance) {
      const totalSlides = instance.slides.length;
      for (let i = 0; i < totalSlides + 1; i++) {
        setTimeout(() => {
          const currentIndex = instance.activeIndex;
          if (currentIndex < totalSlides - 1) {
            instance.slideNext();
            console.log(
              `[Test] ${i + 1}th Next - Current: ${instance.activeIndex + 1}`
            );
          } else {
            console.log("[Test] Check if the last slide is stopped");
          }
        }, i * 800);
      }
    }
  };
}

console.log("[CertificateSwiper] module loaded successfully");
