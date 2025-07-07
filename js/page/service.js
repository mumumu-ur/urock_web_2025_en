/**
 * 서비스 통합 스크립트
 * 서비스 페이지와 서비스 섹션 기능을 모두 포함
 */

// 서비스 페이지 설정
const SERVICE_PAGES = {
  "service-01-analysis": {
    id: "analysis",
    text: "Digital Forensic Analysis",
    href: "/html/page/service-01-analysis.html",
  },
  "service-02-authentication": {
    id: "authentication",
    text: "International Certification",
    href: "/html/page/service-02-authentication.html",
  },
  "service-03-education": {
    id: "education",
    text: "Digital Forensic Education",
    href: "/html/page/service-03-education.html",
  },
};

// 서비스 페이지 공통 탭 설정 생성
function createServiceTabConfig() {
  const currentPath = window.location.pathname;

  return {
    mainTabs: Object.values(SERVICE_PAGES).map((page) => ({
      ...page,
      isActive: currentPath.includes(
        page.href.split("/").pop().replace(".html", "")
      ),
    })),
  };
}

// Contact us 버튼 설정
function setupInquiryButton() {
  const inquiryButton = document.querySelector(".btn .button");
  if (inquiryButton && !inquiryButton.dataset.eventAttached) {
    inquiryButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "/html/page/support-01-inquiry.html";
    });
    inquiryButton.dataset.eventAttached = "true";
    console.log("[Service] Contact us button event set");
  }
}

// 현재 페이지 타입 감지 (개선된 버전)
function getCurrentPageType() {
  const currentPath = window.location.pathname;
  console.log("[Service] current path:", currentPath);

  // 서비스 페이지 패턴 확인
  const servicePatterns = [
    { key: "service-01-analysis", pattern: ["analysis", "service-01"] },
    {
      key: "service-02-authentication",
      pattern: ["authentication", "service-02"],
    },
    { key: "service-03-education", pattern: ["education", "service-03"] },
  ];

  for (const service of servicePatterns) {
    if (service.pattern.some((pattern) => currentPath.includes(pattern))) {
      console.log(`[Service] page type detected: ${service.key}`);
      return service.key;
    }
  }

  console.log("[Service] unknown page type, using default");
  return null;
}

// 포렌식 분석 서비스 페이지 초기화
function initAnalysisService() {
  console.log("[Service] Digital Forensic Analysis page initialized");

  // 포렌식 분석 서비스 특별 기능
  // 여기에 분석 서비스만의 특별한 기능을 추가할 수 있습니다

  console.log("[Service] Digital Forensic Analysis page initialized");
}

// 국제 표준화 인증 서비스 페이지 초기화
function initAuthenticationService() {
  console.log("[Service] International Certification page initialized");

  // 국제 표준화 인증 특별 기능
  // 여기에 인증 서비스만의 특별한 기능을 추가할 수 있습니다

  console.log("[Service] International Certification page initialized");
}

// 포렌식 교육 서비스 페이지 초기화
function initEducationService() {
  console.log("[Service] Digital Forensic Education page initialized");

  // 포렌식 교육 특별 기능
  // 여기에 교육 서비스만의 특별한 기능을 추가할 수 있습니다

  console.log("[Service] Digital Forensic Education page initialized");
}

// 페이지별 초기화
function initializePageFeatures(pageType) {
  if (!pageType) {
    console.warn("[Service] unknown page type");
    setupInquiryButton();
    return;
  }

  const pageInfo = SERVICE_PAGES[pageType];
  console.log(`[Service] ${pageInfo.text} page initialized`);

  // 공통 기능 설정
  setupInquiryButton();

  // 페이지별 특별한 기능 초기화
  switch (pageType) {
    case "service-01-analysis":
      initAnalysisService();
      break;
    case "service-02-authentication":
      initAuthenticationService();
      break;
    case "service-03-education":
      initEducationService();
      break;
  }
}

// 메인 서비스 페이지 초기화 함수
function initServicePage() {
  console.log("[Service] service page script loaded");

  // 탭 설정 생성 및 전역 변수 설정
  window.serviceTabConfig = createServiceTabConfig();
  window.pageTabConfig = window.serviceTabConfig;

  // 현재 페이지 타입에 맞는 초기화
  const pageType = getCurrentPageType();
  initializePageFeatures(pageType);
}

// 서비스 섹션 초기화
function initServiceSection() {
  console.log("[Section] service section initialized");

  // 서비스 섹션 요소 찾기
  const serviceSections = document.querySelectorAll(".service");

  serviceSections.forEach((service) => {
    // 서비스 카드
    const cards = service.querySelectorAll(".service-card");

    // 카드 호버 효과
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.classList.add("hovered");
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("hovered");
      });

      // 카드 클릭 시 상세 페이지로 이동
      card.addEventListener("click", () => {
        const link = card.getAttribute("data-link");
        if (link) {
          window.location.href = link;
        }
      });
    });

    // 탭 기능 (있는 경우)
    const tabs = service.querySelectorAll(".service-tab");
    const tabContents = service.querySelectorAll(".service-tab-content");

    if (tabs.length > 0 && tabContents.length > 0) {
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
          // 모든 탭 비활성화
          tabs.forEach((t) => {
            t.classList.remove("active");
          });

          // 클릭한 탭 활성화
          tab.classList.add("active");

          // 모든 탭 컨텐츠 숨기기
          tabContents.forEach((content) => {
            content.classList.remove("active");
          });

          // 해당 탭 컨텐츠 표시
          const contentId = tab.getAttribute("data-tab");
          const targetContent = service.querySelector(
            `.service-tab-content[data-tab="${contentId}"]`
          );

          if (targetContent) {
            targetContent.classList.add("active");
          }
        });
      });

      // 첫 번째 탭 활성화 (초기 상태)
      if (tabs[0] && tabContents[0]) {
        tabs[0].classList.add("active");
        tabContents[0].classList.add("active");
      }
    }
  });
}

// allComponentsLoaded 이벤트는 componentManager에서 처리하므로 제거

// 통합 초기화 함수
function initService() {
  console.log("[Service] service integration script initialized");

  // 서비스 페이지 기능 초기화
  initServicePage();

  // 서비스 섹션 기능 초기화
  initServiceSection();
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initService);

// 전역에서 접근 가능하도록 함수들을 window 객체에 추가
window.initService = initService;
window.initServicePage = initServicePage;
window.initServiceSection = initServiceSection;
window.initAnalysisService = initAnalysisService;
window.initAuthenticationService = initAuthenticationService;
window.initEducationService = initEducationService;
