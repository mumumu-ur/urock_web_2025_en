// Swiper 동적 로딩 함수
async function loadSwiperLibrary() {
  // 이미 Swiper가 로드되어 있는지 확인
  if (window.Swiper) {
    console.log("[Swiper] using existing Swiper library");
    return window.Swiper;
  }

  try {
    // 동적으로 Swiper 스크립트 로드
    if (!document.querySelector('script[src*="swiper-bundle.min.js"]')) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
      script.onload = () => {
        console.log("[Swiper] CDN script loaded");
      };
      document.head.appendChild(script);

      // 스크립트 로딩 대기
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        // 이미 로드된 경우를 위한 타이머
        setTimeout(() => {
          if (window.Swiper) resolve();
        }, 100);
      });
    }

    // 로딩 완료까지 대기 (최대 5초)
    for (let i = 0; i < 50; i++) {
      if (window.Swiper) {
        console.log("[Swiper] library load check completed");
        return window.Swiper;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error("Swiper loading timeout");
  } catch (error) {
    console.error("[Swiper] library loading failed:", error);
    return null;
  }
}

// 이미지 로딩 완료 대기 함수
async function waitForImagesLoaded(container) {
  const images = container.querySelectorAll("img");
  const imagePromises = Array.from(images).map((img) => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.addEventListener("load", resolve);
        img.addEventListener("error", resolve); // 에러 시에도 진행
      }
    });
  });

  try {
    await Promise.all(imagePromises);
    console.log("[Swiper] all images loaded");
  } catch (error) {
    console.warn("[Swiper] some images failed to load, continuing...");
  }
}

// Swiper 갤러리 초기화 함수
export async function initSwiperGallery() {
  console.log("[Swiper] gallery initialization started");

  // DOM 요소 확인
  const galleryTopElement = document.querySelector(".gallery-top");
  const galleryThumbsElement = document.querySelector(".gallery-thumbs");

  if (!galleryTopElement || !galleryThumbsElement) {
    console.log("[Swiper] gallery elements not found");
    return false;
  }

  // 기존 Swiper 인스턴스가 있으면 제거
  if (galleryTopElement.swiper) {
    galleryTopElement.swiper.destroy(true, true);
    console.log("[Swiper] existing galleryTop instance removed");
  }
  if (galleryThumbsElement.swiper) {
    galleryThumbsElement.swiper.destroy(true, true);
    console.log("[Swiper] existing galleryThumbs instance removed");
  }

  // 이미지 로딩 완료 대기
  console.log("[Swiper] waiting for images to load...");
  await waitForImagesLoaded(galleryTopElement);
  await waitForImagesLoaded(galleryThumbsElement);

  // Swiper 라이브러리 로딩
  const SwiperClass = await loadSwiperLibrary();

  if (!SwiperClass) {
    console.error("[Swiper] Swiper library loading failed");
    return false;
  }

  try {
    console.log(
      "[Swiper] Swiper class check completed, initialization started"
    );

    // 썸네일 Swiper 초기화
    const galleryThumbs = new SwiperClass(".gallery-thumbs", {
      spaceBetween: 10,
      slidesPerView: 5,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      loop: true,
      breakpoints: {
        480: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 5,
        },
      },
    });

    console.log("[Swiper] thumbnail Swiper initialization completed");

    // 메인 갤러리 Swiper 초기화
    const galleryTop = new SwiperClass(".gallery-top", {
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: galleryThumbs,
      },
    });

    console.log("[Swiper] main gallery Swiper initialization completed");

    // 초기화 후 잠깐 대기 후 업데이트 (picture 태그 반응형 처리)
    setTimeout(() => {
      galleryTop.update();
      galleryThumbs.update();
      console.log("[Swiper] gallery update completed");
    }, 100);

    return true;
  } catch (error) {
    console.error("[Swiper] gallery initialization failed:", error);
    return false;
  }
}

// 안전한 초기화 함수 (재시도 로직 포함)
async function safeInitSwiper(retries = 3) {
  if (retries <= 0) {
    console.error("[Swiper] maximum retry count exceeded");
    return;
  }

  try {
    const success = await initSwiperGallery();
    if (success) {
      console.log("[Swiper] initialization successful");

      // 반응형 처리를 위한 리사이즈 이벤트 리스너 추가
      setupResponsiveHandler();
    } else {
      console.log(
        `[Swiper] initialization failed, ${retries - 1} retries remaining`
      );
      setTimeout(() => {
        safeInitSwiper(retries - 1);
      }, 1000);
    }
  } catch (error) {
    console.error("[Swiper] initialization error:", error);
    setTimeout(() => {
      safeInitSwiper(retries - 1);
    }, 1000);
  }
}

// 반응형 처리 핸들러 설정
function setupResponsiveHandler() {
  let resizeTimeout;

  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const galleryTop = document.querySelector(".gallery-top")?.swiper;
      const galleryThumbs = document.querySelector(".gallery-thumbs")?.swiper;

      if (galleryTop && galleryThumbs) {
        console.log("[Swiper] screen size change detected, gallery update");
        galleryTop.update();
        galleryThumbs.update();

        // Picture 태그의 반응형 이미지가 변경될 시간을 기다린 후 한번 더 업데이트
        setTimeout(() => {
          galleryTop.update();
          galleryThumbs.update();
        }, 200);
      }
    }, 300);
  };

  // 기존 리스너 제거 (중복 방지)
  window.removeEventListener("resize", handleResize);
  window.addEventListener("resize", handleResize);

  console.log("[Swiper] responsive handler setup completed");
}

// 전역에서 접근 가능하도록 설정
if (typeof window !== "undefined") {
  window.initSwiperGallery = initSwiperGallery;
  window.safeInitSwiper = safeInitSwiper;
}

// 컨텐츠 로드 시 자동 초기화
if (typeof document !== "undefined") {
  // 문서 로드 시 Swiper 상태 확인
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[Swiper] DOMContentLoaded - Swiper status check");
    console.log("[Swiper] window.Swiper:", typeof window.Swiper);
  });

  // 탭 컨텐츠 로드 완료 시 초기화
  document.addEventListener("tabContentLoaded", (event) => {
    const { contentPath } = event.detail;
    if (contentPath && contentPath.includes("service-03-education")) {
      console.log("[Swiper] education tab loaded, safe initialization started");
      setTimeout(() => {
        safeInitSwiper();
      }, 300);
    }
  });

  // allComponentsLoaded 이벤트에서도 초기화 시도
  document.addEventListener("allComponentsLoaded", () => {
    setTimeout(() => {
      if (
        document.querySelector(".gallery-top") &&
        document.querySelector(".gallery-thumbs")
      ) {
        console.log(
          "[Swiper] allComponentsLoaded - gallery detected, initialization started"
        );
        safeInitSwiper();
      }
    }, 500);
  });
}

// intro title text edit
