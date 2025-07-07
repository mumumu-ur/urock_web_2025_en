import { toRelativePath } from "../global/utils.js";

/**
 * 탭 컴포넌트 생성 함수
 * 주어진 ID의 컨테이너에 탭 컴포넌트를 생성합니다.
 * @param {string} containerId - 탭을 생성할 컨테이너의 ID
 * @param {object} config - 탭 구성 설정 (옵션)
 */

function createTabComponent(containerId, config) {
  if (!config || !Array.isArray(config.mainTabs)) {
    console.error("[Tab] invalid config passed to createTabComponent:", config);
    return;
  }

  // 컨테이너 요소 가져오기
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Element with ID "${containerId}" not found.`);
    return;
  }

  // 중복 초기화 방지
  if (container.dataset.tabInitialized === "true") {
    console.log(`[Tab] ${containerId} already initialized, skipping`);
    return;
  }
  container.dataset.tabInitialized = "true";

  // 컨테이너가 비어있거나 필수 구조가 없는 경우 기본 구조 확인
  if (
    !container.querySelector(".tab-main") ||
    container.innerHTML.trim() === ""
  ) {
    console.log("[Tab] no basic structure found, creating temporary structure");
    // 최소한의 임시 구조만 생성 (initializeTabHTML에서 완전한 구조로 교체됨)
    container.innerHTML = '<div class="tab-placeholder">Loading...</div>';
  }

  // 기본 설정 사용 (config가 없을 경우)
  config =
    config ||
    (typeof solutionTabConfig !== "undefined"
      ? solutionTabConfig
      : {
          mainTabs: [
            { id: "dfas", text: "DFAS", isActive: true },
            { id: "mcq", text: "M-SecuManage", isActive: false },
            { id: "gm", text: "GateManager", isActive: false },
          ],
          subTabs: {
            dfas: [
              { id: "dfas-pro", text: "DFAS Pro", isActive: true },
              {
                id: "dfas-enterprise",
                text: "DFAS Enterprise",
                isActive: false,
              },
            ],
            mcq: [
              { id: "mcq-p", text: "M-SecuManager P", isActive: true },
              { id: "mcq-s", text: "M-SecuManager S", isActive: false },
              { id: "mcq-g", text: "M-SecuManager G", isActive: false },
            ],
            gm: [
              { id: "gm-basic", text: "GateManager", isActive: true },
              { id: "gm-pro", text: "GateManager Pro", isActive: false },
            ],
          },
        });

  // 초기 상태 설정
  let activeMainTab = config.mainTabs.find((tab) => tab.isActive).id;
  let activeSubTab = "";

  if (
    config.subTabs &&
    config.subTabs[activeMainTab] &&
    config.subTabs[activeMainTab].length > 0
  ) {
    const activeSubTabObject = config.subTabs[activeMainTab].find(
      (tab) => tab.isActive
    );
    if (activeSubTabObject) {
      activeSubTab = activeSubTabObject.id;
    } else {
      // isActive가 true인 서브탭이 없으면 첫 번째 서브탭을 기본값으로 설정
      activeSubTab = config.subTabs[activeMainTab][0].id;
      console.log(
        `[Tab] setting ${activeMainTab} tab's default subtab to ${activeSubTab}`
      );
    }
  }

  // DOM 요소 캐시
  let tabContentElement, selectedTabContent, mainTabs, subTabs, subTabLinks;

  // HTML 생성 함수들
  function generateMainTabsHTML() {
    return config.mainTabs
      .map(
        (tab) => `
      <a href="javascript:void(0)" class="tab-${tab.id}${
          tab.isActive ? " active" : ""
        }" data-tab="${tab.id}">
        <div class="tab-text">${tab.text}</div>
      </a>
    `
      )
      .join("");
  }

  function generateSubTabsHTML() {
    if (!config.subTabs) return "";

    return Object.keys(config.subTabs)
      .map((mainTabId) => {
        const subTabs = config.subTabs[mainTabId];
        if (!subTabs || subTabs.length === 0) return "";

        const subTabItems = subTabs
          .map(
            (subTab) => `
        <div class="tab-menu">
          <a href="javascript:void(0)" class="txt-${subTab.id}${
              subTab.isActive ? " active" : ""
            }" data-subtab="${subTab.id}">
            <div class="tab-text">${subTab.text}</div>
          </a>
        </div>
      `
          )
          .join("");

        return `
        <div class="tab-sub" id="${mainTabId}-sub" data-parent="${mainTabId}" ${
          mainTabId === activeMainTab ? "" : 'style="display:none;"'
        }>
          <div class="tab-text-group">
            ${subTabItems}
          </div>
          <div class="focus-bar"></div>
        </div>
      `;
      })
      .join("");
  }

  // 전체 탭 HTML 생성 및 삽입
  function initializeTabHTML() {
    const tabHTML = `
      <section class="tab">
        <div class="tab-main-bg">
          <div class="tab-main">
            ${generateMainTabsHTML()}
          </div>
        </div>
        ${generateSubTabsHTML()}
        <div class="tab-content">
          <div id="selected-tab-content">
            <!-- 컨텐츠 영역 -->
          </div>
        </div>
      </section>
    `;

    container.innerHTML = tabHTML;

    // DOM 요소 캐시 업데이트
    updateDOMCache();
  }

  // DOM 요소 캐시 업데이트
  function updateDOMCache() {
    tabContentElement = container.querySelector(".tab-content");
    selectedTabContent = container.querySelector("#selected-tab-content");
    mainTabs = container.querySelectorAll(".tab-main a");
    subTabs = container.querySelectorAll(".tab-sub");
    subTabLinks = container.querySelectorAll(".tab-menu a");
  }

  // 반응형 탭 스크롤 설정
  function setupResponsiveTabScroll() {
    const mainTabContainer = container.querySelector(".tab-main");
    const subTabGroups = container.querySelectorAll(".tab-text-group");

    // 모바일에서 탭 스크롤을 부드럽게 하기 위한 설정
    if (window.innerWidth <= 480) {
      // 메인 탭 스크롤 설정
      if (mainTabContainer) {
        mainTabContainer.style.scrollBehavior = "smooth";

        // 활성 탭이 보이도록 스크롤 조정
        const activeMainTab = mainTabContainer.querySelector("a.active");
        if (activeMainTab) {
          setTimeout(() => {
            activeMainTab.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }, 100);
        }
      }

      // 서브 탭 스크롤 설정
      subTabGroups.forEach((group) => {
        if (group) {
          group.style.scrollBehavior = "smooth";

          // 활성 서브 탭이 보이도록 스크롤 조정
          const activeSubTab = group.querySelector("a.active");
          if (activeSubTab) {
            setTimeout(() => {
              activeSubTab.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
              });
            }, 150);
          }
        }
      });
    }
  }

  // 높이 조정 함수 (개선된 반응형 유동적 높이)
  function adjustTabContentHeight() {
    if (!tabContentElement || !selectedTabContent) return;

    // CSS에서 자동으로 높이가 조정되도록 스타일 초기화
    tabContentElement.style.height = "auto";
    selectedTabContent.style.height = "auto";

    // 반응형 최소 높이 설정
    let minHeight;
    const screenWidth = window.innerWidth;

    if (screenWidth <= 360) {
      minHeight = 100; // 초소형 모바일
    } else if (screenWidth <= 480) {
      minHeight = 120; // 모바일
    } else if (screenWidth <= 768) {
      minHeight = 150; // 태블릿
    } else {
      minHeight = 200; // 데스크톱
    }

    // 반응형 패딩 계산
    const paddingHeight =
      screenWidth <= 360 ? 40 : screenWidth <= 480 ? 50 : 60;

    // 실제 컨텐츠 높이 측정
    const contentHeight = selectedTabContent.scrollHeight;

    // 최종 높이 계산 (최소 높이와 실제 컨텐츠 높이 중 큰 값)
    const finalHeight = Math.max(contentHeight + paddingHeight, minHeight);

    // 컨텐츠가 최소 높이보다 클 때만 명시적으로 높이 설정
    if (contentHeight + paddingHeight > minHeight) {
      tabContentElement.style.minHeight = finalHeight + "px";
    } else {
      tabContentElement.style.minHeight = minHeight + "px";
    }

    console.log(
      `[Tab] responsive content height adjustment: ${finalHeight}px (screen width: ${screenWidth}px, content: ${contentHeight}px, minimum: ${minHeight}px)`
    );
  }

  // ResizeObserver 설정 (컨텐츠 크기 변화 감지)
  function setupResizeObserver() {
    if (!selectedTabContent || typeof ResizeObserver === "undefined") return;

    // 기존 observer가 있으면 해제
    if (container.resizeObserver) {
      container.resizeObserver.disconnect();
    }

    // 새로운 ResizeObserver 생성
    container.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // 디바운싱을 위한 타이머
        clearTimeout(container.resizeTimeout);
        container.resizeTimeout = setTimeout(() => {
          adjustTabContentHeight();
        }, 100);
      }
    });

    // 컨텐츠 영역 관찰 시작
    container.resizeObserver.observe(selectedTabContent);
  }

  // 컨텐츠 경로 매핑
  function getContentPath() {
    console.log(
      `[Tab] path mapping attempt: activeMainTab=${activeMainTab}, activeSubTab=${activeSubTab}`
    );
    const isDev = !window.location.href.includes("urock_homepage_bucket");
    // 각 메인 탭별 경로 매핑
    let contentPath = isDev ? "" : "/urock_homepage_bucket";

    switch (activeMainTab) {
      case "dfas":
        contentPath =
          activeSubTab === "dfas-enterprise"
            ? contentPath + "/html/detail/detail-solution-02-dfas-ent.html"
            : contentPath + "/html/detail/detail-solution-01-dfas-pro.html";
        break;

      case "mcq":
        const mcqPaths = {
          "mcq-p": contentPath + "/html/detail/detail-solution-03-mcq-p.html",
          "mcq-s": contentPath + "/html/detail/detail-solution-04-mcq-s.html",
          "mcq-g": contentPath + "/html/detail/detail-solution-05-mcq-g.html",
        };
        contentPath = mcqPaths[activeSubTab] || mcqPaths["mcq-p"]; // 기본값: mcq-p
        break;

      case "gm":
        contentPath =
          activeSubTab === "gm-pro"
            ? contentPath + "/html/detail/detail-solution-07-gm-pro.html"
            : contentPath + "/html/detail/detail-solution-06-gm.html";
        break;

      case "analysis":
        contentPath =
          contentPath + "/html/detail/detail-service-01-analysis.html";
        break;

      case "authentication":
        contentPath =
          contentPath + "/html/detail/detail-service-02-authentication.html";
        break;

      case "education":
        contentPath =
          contentPath + "/html/detail/detail-service-03-education.html";
        break;

      case "inquiry":
        contentPath =
          contentPath + "/html/detail/detail-support-01-inquiry.html";
        break;

      case "news":
        // news 탭의 서브 탭 처리
        const newsPaths = {
          news: "/html/detail/detail-support-news/detail-01-news.html",
          business: "/html/detail/detail-support-news/detail-02-business.html",
          education:
            "/html/detail/detail-support-news/detail-03-education.html",
          exhibition:
            "/html/detail/detail-support-news/detail-04-exhibition.html",
          notice: "/html/detail/detail-support-news/detail-05-notice.html",
        };

        if (activeSubTab && newsPaths[activeSubTab]) {
          contentPath = contentPath + newsPaths[activeSubTab];
        } else {
          // 서브 탭이 없거나 기본값인 경우 메인 news 페이지 로드
          contentPath =
            contentPath + "/html/detail/detail-support-02-news.html";
        }
        break;

      default:
        console.warn(`[Tab] unknown main tab: ${activeMainTab}`);
        contentPath = "";
    }

    console.log(`[Tab] mapped path: ${contentPath}`);
    return contentPath;
  }

  // 컨텐츠 업데이트 함수
  function updateContent() {
    if (!selectedTabContent) {
      console.error("[Tab] selectedTabContent not found");
      return;
    }

    const mainTabElement = container.querySelector(
      `.tab-main a[data-tab="${activeMainTab}"]`
    );
    if (!mainTabElement) {
      console.error(`[Tab] main tab element not found: ${activeMainTab}`);
      return;
    }

    const mainTabText = mainTabElement.querySelector(".tab-text").textContent;

    // 로딩 표시
    selectedTabContent.innerHTML = '<div class="loading">Loading...</div>';
    adjustTabContentHeight();

    const contentPath = getContentPath();

    if (!contentPath) {
      selectedTabContent.innerHTML = `
        <div class="tab-content-body">
          <p>Content not found for the selected tab.</p>
          <p>Current tab: ${activeMainTab} ${
        activeSubTab ? "/ " + activeSubTab : ""
      }</p>
        </div>
      `;
      adjustTabContentHeight();
      return;
    }

    // 컨텐츠 로드
    fetch(toRelativePath(contentPath))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.text();
      })
      .then((html) => {
        if (!html.trim()) {
          selectedTabContent.innerHTML = `
            <div class="tab-content-body">
              <p>Preparing content...</p>
            </div>
          `;
        } else {
          selectedTabContent.innerHTML = `
            <div class="tab-content-container">
              ${html}
            </div>
          `;

          // 이미지 경로 수정
          selectedTabContent.querySelectorAll("img").forEach((img) => {
            const originalSrc = img.getAttribute("src");
            if (
              originalSrc &&
              (originalSrc.startsWith("./") || originalSrc.startsWith("../"))
            ) {
              const basePath = contentPath.substring(
                0,
                contentPath.lastIndexOf("/") + 1
              );
              img.src = new URL(
                originalSrc,
                window.location.origin + basePath
              ).href;
            }
          });
        }

        // 높이 조정 및 ResizeObserver 설정 (다단계 조정)
        requestAnimationFrame(() => {
          adjustTabContentHeight();
          setupResizeObserver();

          // 추가 조정 (이미지나 동적 컨텐츠를 위해)
          setTimeout(() => {
            adjustTabContentHeight();
          }, 200);

          // 최종 조정 (모든 리소스 로드 완료 후)
          setTimeout(() => {
            adjustTabContentHeight();

            // 탭 컨텐츠 로드 완료 이벤트 발생 (입력 필드 초기화용)
            document.dispatchEvent(
              new CustomEvent("tabContentLoaded", {
                detail: {
                  contentPath: contentPath,
                  activeMainTab: activeMainTab,
                  activeSubTab: activeSubTab,
                  contentElement: selectedTabContent,
                },
              })
            );

            // 모바일 메뉴 재초기화 (Detail 페이지 로드 시) - 개선된 방식
            console.log("🔄 tab content loaded, reinitializing mobile menu");

            // 약간의 지연을 두고 확실하게 재초기화
            setTimeout(() => {
              if (typeof window.reInitMobileMenu === "function") {
                console.log("📱 reinitializing mobile menu");
                window.reInitMobileMenu();
              } else {
                console.warn("❌ reInitMobileMenu function not found");
              }
            }, 200);

            // 추가 안전장치: 더 늦은 시점에 한번 더 시도
            setTimeout(() => {
              const hasSubmenuLinks = document.querySelectorAll(
                ".mobile-drawer-menu .menu-link.has-submenu"
              );
              console.log(
                `🔍 additional verification - submenu links: ${hasSubmenuLinks.length}`
              );

              if (
                hasSubmenuLinks.length > 0 &&
                typeof window.reInitMobileMenu === "function"
              ) {
                // 이벤트 리스너가 실제로 바인딩되었는지 테스트
                const testLink = hasSubmenuLinks[0];
                const hasClickHandler =
                  testLink.onclick || testLink.addEventListener;

                if (!hasClickHandler) {
                  console.log(
                    "🔧 event listener not found, additional reinitialization"
                  );
                  window.reInitMobileMenu();
                }
              }
            }, 500);

            // Swiper 초기화 (교육 서비스 페이지인 경우)
            if (contentPath && contentPath.includes("service-03-education")) {
              if (typeof window.safeInitSwiper === "function") {
                console.log("[Tab] safe Swiper gallery initialization started");
                setTimeout(async () => {
                  await window.safeInitSwiper();
                }, 100);
              } else if (typeof window.initSwiperGallery === "function") {
                console.log(
                  "[Tab] basic Swiper gallery initialization started"
                );
                setTimeout(async () => {
                  await window.initSwiperGallery();
                }, 100);
              } else {
                console.warn("[Tab] Swiper initialization function not found");
              }
            }

            // 백업: 직접 호출 방식
            if (typeof window.initializeInputFields === "function") {
              window.initializeInputFields();
            }

            // 추가: 초기화 컴포넌트 호출
            if (typeof window.initIntroComponent === "function") {
              window.initIntroComponent();
            }
          }, 500);
        });

        console.log(`[Tab] ${contentPath} content loaded`);
      })
      .catch((error) => {
        console.error(`[Tab] content load failed: ${error.message}`);
        selectedTabContent.innerHTML = `
          <div class="tab-content-body">
            <p>An error occurred while loading the content.</p>
            <p>Path: ${contentPath}</p>
            <p>Error: ${error.message}</p>
          </div>
        `;
        setTimeout(adjustTabContentHeight, 100);
      });
  }

  // 이벤트 리스너 설정
  function setupEventListeners() {
    // 메인 탭 클릭 이벤트
    mainTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();

        // 탭 활성화 상태 업데이트
        mainTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        activeMainTab = tab.getAttribute("data-tab");

        // 서브 탭 표시/숨김
        subTabs.forEach((subTab) => (subTab.style.display = "none"));

        const activeSubTabGroup = container.querySelector(
          `#${activeMainTab}-sub`
        );
        if (activeSubTabGroup) {
          activeSubTabGroup.style.display = "block";
          let activeSubTabLink =
            activeSubTabGroup.querySelector(".tab-menu a.active");

          if (activeSubTabLink) {
            activeSubTab = activeSubTabLink.getAttribute("data-subtab");
          } else {
            // 활성화된 서브탭이 없으면 첫 번째 서브탭을 활성화
            const firstSubTabLink =
              activeSubTabGroup.querySelector(".tab-menu a");
            if (firstSubTabLink) {
              firstSubTabLink.classList.add("active");
              activeSubTab = firstSubTabLink.getAttribute("data-subtab");
              console.log(
                `[Tab] automatically activating the first subtab of the ${activeMainTab} tab: ${activeSubTab}`
              );
            }
          }
        } else {
          activeSubTab = "";
        }

        updateContent();
        setupResponsiveTabScroll(); // 탭 변경 시 스크롤 조정
        if (typeof window.initIntroComponent === "function") {
          window.initIntroComponent();
        }
      });
    });

    // 서브 탭 클릭 이벤트
    subTabLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const currentSubTab = link.closest(".tab-sub");
        const groupLinks = currentSubTab.querySelectorAll(".tab-menu a");

        groupLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        activeSubTab = link.getAttribute("data-subtab");

        updateContent();
        setupResponsiveTabScroll(); // 서브 탭 변경 시 스크롤 조정
        if (typeof window.initIntroComponent === "function") {
          window.initIntroComponent();
        }
      });
    });

    // 윈도우 리사이즈 이벤트 (디바운싱 적용)
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        adjustTabContentHeight();
        setupResponsiveTabScroll(); // 반응형 탭 스크롤 재설정
      }, 150);
    });
  }

  console.log("createTabComponent is defined:", typeof createTabComponent);

  // 초기화
  initializeTabHTML();
  setupEventListeners();
  updateContent();

  // 초기 반응형 설정
  setTimeout(() => {
    setupResponsiveTabScroll();
  }, 300);
}
// 전역 탭 초기화 함수
window.createTabComponent = createTabComponent;

// 탭 재초기화 함수
window.reInitTabComponent = function (
  containerId = "tab-container",
  config = null
) {
  const container = document.getElementById(containerId);
  if (container) {
    // 초기화 플래그 리셋
    container.dataset.tabInitialized = "false";
    createTabComponent(containerId, config || window.solutionTabConfig);
  }
};

// 초기화는 componentManager에서 통합 관리하므로 개별 이벤트 리스너 제거
console.log("[Tab] tab component script loaded");

// 즉시 실행 탭 초기화 함수 (개선된 버전)
function immediateTabInit() {
  console.log("[Tab] immediate tab initialization started");

  const tabContainer = document.getElementById("tab-container");
  if (!tabContainer) {
    console.log("[Tab] tab-container not found, waiting for delay execution");
    return false;
  }

  // 이미 초기화되었는지 확인
  if (tabContainer.dataset.tabInitialized === "true") {
    console.log("[Tab] already initialized tab container, skipping");
    return true;
  }

  const currentPath = window.location.pathname;
  let config = null;

  // 페이지별 설정 결정
  if (currentPath.includes("support")) {
    const activeMainTab = currentPath.includes("support-02-news")
      ? "news"
      : "inquiry";
    config = {
      mainTabs: [
        {
          id: "inquiry",
          text: "Contact us",
          isActive: activeMainTab === "inquiry",
        },
        { id: "news", text: "유락소식", isActive: activeMainTab === "news" },
      ],
      subTabs: {
        news: [
          { id: "news", text: "UROCK News", isActive: true },
          { id: "business", text: "Business", isActive: false },
          { id: "education", text: "교육", isActive: false },
          { id: "exhibition", text: "Exhibition", isActive: false },
          { id: "notice", text: "공지사항", isActive: false },
        ],
      },
    };
    window.supportTabConfig = config;
  } else if (currentPath.includes("solution")) {
    let activeMainTab = "dfas";
    let activeSubTab = "dfas-pro";

    if (currentPath.includes("dfas-ent")) {
      activeMainTab = "dfas";
      activeSubTab = "dfas-enterprise";
    } else if (currentPath.includes("mcq-p")) {
      activeMainTab = "mcq";
      activeSubTab = "mcq-p";
    } else if (currentPath.includes("mcq-s")) {
      activeMainTab = "mcq";
      activeSubTab = "mcq-s";
    } else if (currentPath.includes("mcq-g")) {
      activeMainTab = "mcq";
      activeSubTab = "mcq-g";
    } else if (currentPath.includes("gm-pro")) {
      activeMainTab = "gm";
      activeSubTab = "gm-pro";
    } else if (currentPath.includes("gm")) {
      activeMainTab = "gm";
      activeSubTab = "gm";
    }

    config = {
      mainTabs: [
        { id: "dfas", text: "DFAS", isActive: activeMainTab === "dfas" },
        { id: "mcq", text: "MCQ", isActive: activeMainTab === "mcq" },
        { id: "gm", text: "GateManager", isActive: activeMainTab === "gm" },
      ],
      subTabs: {
        dfas: [
          {
            id: "dfas-pro",
            text: "DFAS Pro",
            isActive: activeSubTab === "dfas-pro",
          },
          {
            id: "dfas-enterprise",
            text: "DFAS Enterprise",
            isActive: activeSubTab === "dfas-enterprise",
          },
        ],
        mcq: [
          {
            id: "mcq-p",
            text: "M-SecuManager P",
            isActive: activeSubTab === "mcq-p",
          },
          {
            id: "mcq-s",
            text: "M-SecuManager S",
            isActive: activeSubTab === "mcq-s",
          },
          {
            id: "mcq-g",
            text: "M-SecuManager G",
            isActive: activeSubTab === "mcq-g",
          },
        ],
        gm: [
          { id: "gm", text: "GateManager", isActive: activeSubTab === "gm" },
          {
            id: "gm-pro",
            text: "GateManager Pro",
            isActive: activeSubTab === "gm-pro",
          },
        ],
      },
    };
    window.solutionTabConfig = config;
  } else if (currentPath.includes("service")) {
    let activeMainTab = "analysis";
    if (currentPath.includes("authentication"))
      activeMainTab = "authentication";
    else if (currentPath.includes("education")) activeMainTab = "education";

    config = {
      mainTabs: [
        {
          id: "analysis",
          text: "Forensic Analysis Service",
          isActive: activeMainTab === "analysis",
        },
        {
          id: "authentication",
          text: "International Standardization Certification",
          isActive: activeMainTab === "authentication",
        },
        {
          id: "education",
          text: "Forensic Education",
          isActive: activeMainTab === "education",
        },
      ],
      subTabs: {},
    };
    window.serviceTabConfig = config;
  }

  if (config) {
    try {
      createTabComponent("tab-container", config);
      console.log("[Tab] immediate tab component creation successful");
      return true;
    } catch (error) {
      console.error("[Tab] immediate tab component creation failed:", error);
      return false;
    }
  }

  return false;
}

// 다중 시도 초기화 함수
function multipleAttemptInit() {
  let attempts = 0;
  const maxAttempts = 10;
  const baseDelay = 200;

  const attemptInit = () => {
    attempts++;
    console.log(`[Tab] tab initialization attempt ${attempts}/${maxAttempts}`);

    if (immediateTabInit()) {
      console.log("[Tab] tab initialization successful!");
      return;
    }

    if (attempts < maxAttempts) {
      const delay = baseDelay * attempts; // 점진적 지연
      console.log(`[Tab] retrying in ${delay}ms...`);
      setTimeout(attemptInit, delay);
    } else {
      console.error(
        "[Tab] maximum attempt count exceeded, tab initialization failed"
      );
    }
  };

  attemptInit();
}

// 스크립트 로드 즉시 실행
console.log("[Tab] tab script loaded, immediate initialization attempt");
if (!immediateTabInit()) {
  console.log(
    "[Tab] immediate initialization failed, running multiple attempt mode"
  );
  multipleAttemptInit();
}

// DOMContentLoaded 백업 초기화
document.addEventListener("DOMContentLoaded", function () {
  console.log("[Tab] DOMContentLoaded backup initialization");
  setTimeout(() => {
    if (
      !document.getElementById("tab-container") ||
      document.getElementById("tab-container").dataset.tabInitialized !== "true"
    ) {
      console.log("[Tab] running backup initialization from DOMContentLoaded");
      multipleAttemptInit();
    }
  }, 100);
});

// 모든 컴포넌트 로드 완료 시 백업 초기화
document.addEventListener("allComponentsLoaded", function () {
  console.log("[Tab] allComponentsLoaded final backup initialization");
  setTimeout(() => {
    if (
      !document.getElementById("tab-container") ||
      document.getElementById("tab-container").dataset.tabInitialized !== "true"
    ) {
      console.log(
        "[Tab] running final backup initialization from allComponentsLoaded"
      );
      immediateTabInit();
    }
  }, 200);
});
