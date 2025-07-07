/**
 * Component Manager - 컴포넌트 관리 시스템
 *
 * include.js와 함께 작동하여 컴포넌트의 로드 및 초기화를 관리합니다.
 * 각 컴포넌트가 로드될 때 이벤트를 처리하고 적절한 초기화 함수를 호출합니다.
 */

// 컴포넌트 관리자 객체
window.ComponentManager = {
  // 컴포넌트 등록 정보
  registry: {
    // 기존 컴포넌트 등록
    tab: {
      init: function () {
        if (typeof window.reInitTabComponent === "function")
          window.reInitTabComponent();
      },
    },
    intro: {
      init: function () {
        if (typeof window.initIntroComponent === "function")
          window.initIntroComponent();
      },
    },
    header: {
      init: function () {
        if (typeof window.reInitHeaderComponent === "function")
          window.reInitHeaderComponent();
      },
    },
    footer: {
      init: function () {
        if (typeof window.reInitFooterComponent === "function")
          window.reInitFooterComponent();
      },
    },
    cards: {
      init: function () {
        if (typeof window.reInitCardsComponent === "function")
          window.reInitCardsComponent();
      },
    },
    fab: {
      init: function () {
        if (typeof window.reInitFabComponent === "function")
          window.reInitFabComponent();
      },
    },
    // 누락된 컴포넌트 추가
    breadcrumb: {
      init: function () {
        if (typeof window.reInitBreadcrumbComponent === "function")
          window.reInitBreadcrumbComponent();
      },
    },
    banner: {
      init: function () {
        if (typeof window.reInitBannerComponent === "function")
          window.reInitBannerComponent();
      },
    },
    title: {
      init: function () {
        if (typeof window.reInitTitleComponent === "function")
          window.reInitTitleComponent();
      },
    },
    buttons: {
      init: function () {
        if (typeof window.reInitButtonsComponent === "function")
          window.reInitButtonsComponent();
      },
    },
    // 언어 툴팁 컴포넌트 추가
    "language-tooltip": {
      init: function () {
        console.log("[ComponentManager] language tooltip initialization");
        // 언어 드롭다운 초기화가 아직 안 된 경우에만 실행
        if (
          !window.languageDropdownInitialized &&
          typeof setupLanguageDropdown === "function"
        ) {
          setupLanguageDropdown();
        }
      },
    },
    // 다른 컴포넌트도 필요한 경우 여기에 추가
  },

  // 컴포넌트 등록 메서드
  register: function (name, initFunction) {
    this.registry[name] = { init: initFunction };
    console.log(`[ComponentManager] component registered: ${name}`);
    return this;
  },

  // 개별 컴포넌트 초기화
  initComponent: function (componentName, element) {
    if (!componentName) {
      console.warn("[ComponentManager] component name not provided");
      return;
    }

    console.log(
      `[ComponentManager] component initialization attempt: ${componentName}`
    );

    // 컴포넌트가 등록되어 있는지 확인
    const component = this.registry[componentName];

    if (component && typeof component.init === "function") {
      console.log(
        `[ComponentManager] component initialization executed: ${componentName}`
      );
      try {
        component.init(element);
      } catch (error) {
        console.error(
          `[ComponentManager] component initialization error (${componentName}):`,
          error
        );
      }
    } else {
      console.warn(
        `[ComponentManager] unregistered component: ${componentName}`
      );
    }
  },

  // 모든 컴포넌트 초기화
  initAll: function () {
    console.log("[ComponentManager] all components initialization started");

    for (const [name, component] of Object.entries(this.registry)) {
      if (component && typeof component.init === "function") {
        try {
          component.init();
          console.log(
            `[ComponentManager] component initialization successful: ${name}`
          );
        } catch (error) {
          console.error(
            `[ComponentManager] component initialization error (${name}):`,
            error
          );
        }
      }
    }

    console.log("[ComponentManager] all components initialization completed");
  },
};

// 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", function () {
  console.log("[ComponentManager] DOMContentLoaded event detected");

  // 개별 컴포넌트 로드 이벤트 리스너
  document.addEventListener("componentLoaded", function (event) {
    if (!event.detail) {
      console.warn("[ComponentManager] event detail not found");
      return;
    }

    const { component, element } = event.detail;
    if (!component) {
      console.warn(
        "[ComponentManager] component name not included in the event"
      );
      return;
    }

    console.log(
      `[ComponentManager] component load event detected: ${component}`
    );

    // 컴포넌트 초기화
    window.ComponentManager.initComponent(component, element);
  });

  // 모든 컴포넌트 로드 완료 이벤트 리스너
  document.addEventListener("allComponentsLoaded", function () {
    console.log("[ComponentManager] all components loaded event detected");

    // 헤더 컴포넌트가 있는 경우 모바일 메뉴만 재초기화
    const drawer = document.querySelector(".mobile-drawer-menu");
    if (drawer) {
      console.log(
        "[ComponentManager] header mobile menu reinitialization started"
      );

      // 여러 단계로 재초기화 시도
      const initAttempts = [100, 300, 500];

      initAttempts.forEach((delay, index) => {
        setTimeout(() => {
          console.log(
            `[ComponentManager] mobile menu reinitialization attempt ${
              index + 1
            }/${initAttempts.length}`
          );

          if (typeof window.reInitMobileMenu === "function") {
            window.reInitMobileMenu();

            // 마지막 시도에서는 검증도 수행
            if (index === initAttempts.length - 1) {
              setTimeout(() => {
                const hasSubmenuLinks = document.querySelectorAll(
                  ".mobile-drawer-menu .menu-link.has-submenu"
                );
                console.log(
                  `[ComponentManager] final verification - submenu links: ${hasSubmenuLinks.length}`
                );

                if (hasSubmenuLinks.length === 0) {
                  console.error(
                    "[ComponentManager] ❌ mobile menu initialization failed - no submenu links"
                  );
                } else {
                  console.log(
                    "[ComponentManager] ✅ mobile menu initialization completed"
                  );
                }
              }, 100);
            }
          } else {
            console.warn(
              "[ComponentManager] reInitMobileMenu function not found"
            );
          }
        }, delay);
      });
    } else {
      console.log("[ComponentManager] mobile drawer not found");
    }

    // 언어 툴팁 초기화 추가
    const languageSelector = document.querySelector("header .language");
    if (languageSelector) {
      console.log("[ComponentManager] language tooltip initialization started");

      // 다단계 초기화로 안정성 확보
      const languageInitDelays = [200, 500, 800];

      languageInitDelays.forEach((delay, index) => {
        setTimeout(() => {
          console.log(
            `[ComponentManager] language tooltip initialization attempt ${
              index + 1
            }/${languageInitDelays.length}`
          );

          // 언어 드롭다운이 아직 초기화되지 않은 경우에만 실행
          if (!window.languageDropdownInitialized) {
            if (typeof setupLanguageDropdown === "function") {
              setupLanguageDropdown();
              console.log(
                "[ComponentManager] language tooltip setupLanguageDropdown called"
              );
            } else {
              console.warn(
                "[ComponentManager] setupLanguageDropdown function not found"
              );
            }
          } else {
            console.log(
              "[ComponentManager] language dropdown already initialized"
            );
          }

          // 마지막 시도에서 검증
          if (index === languageInitDelays.length - 1) {
            setTimeout(() => {
              const tooltip = document.querySelector(
                "header .language-tooltip-global"
              );
              console.log(`[ComponentManager] final verification - language selector: ${
                languageSelector ? "✅" : "❌"
              }
                - tooltip element: ${tooltip ? "✅" : "❌"}
                - initialization state: ${
                  window.languageDropdownInitialized ? "✅" : "❌"
                }`);
            }, 100);
          }
        }, delay);
      });
    } else {
      console.log("[ComponentManager] language selector not found");
    }

    // 탭 컴포넌트가 있는 경우 강제 초기화 (개선된 로직)
    if (document.getElementById("tab-container")) {
      console.log(
        "[ComponentManager] tab component forced initialization started"
      );

      // 탭 초기화 함수
      const initializeTabs = () => {
        console.log("[ComponentManager] tab initialization executed");

        const currentPath = window.location.pathname;
        let config = null;

        // 페이지별 설정 생성
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
              {
                id: "news",
                text: "UROCK News",
                isActive: activeMainTab === "news",
              },
            ],
            subTabs: {
              news: [
                { id: "news", text: "UROCK News", isActive: true },
                { id: "business", text: "Business", isActive: false },
                { id: "education", text: "Education", isActive: false },
                { id: "exhibition", text: "Exhibition", isActive: false },
                { id: "notice", text: "Notice", isActive: false },
              ],
            },
          };
        } else if (currentPath.includes("solution")) {
          let activeMainTab = "dfas";
          let activeSubTab = "dfas-pro";

          // 현재 페이지에 따라 활성 탭 결정
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
              {
                id: "gm",
                text: "GateManager",
                isActive: activeMainTab === "gm",
              },
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
                {
                  id: "gm",
                  text: "GateManager",
                  isActive: activeSubTab === "gm",
                },
                {
                  id: "gm-pro",
                  text: "GateManager Pro",
                  isActive: activeSubTab === "gm-pro",
                },
              ],
            },
          };
        } else if (currentPath.includes("service")) {
          let activeMainTab = "analysis";
          if (currentPath.includes("authentication"))
            activeMainTab = "authentication";
          else if (currentPath.includes("education"))
            activeMainTab = "education";

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
        }

        // 설정을 전역에 저장
        if (config) {
          if (currentPath.includes("support")) window.supportTabConfig = config;
          else if (currentPath.includes("solution"))
            window.solutionTabConfig = config;
          else if (currentPath.includes("service"))
            window.serviceTabConfig = config;
        }

        // 탭 컴포넌트 생성
        if (config && typeof window.createTabComponent === "function") {
          console.log("[ComponentManager] tab component creation:", config);
          try {
            window.createTabComponent("tab-container", config);
            console.log("[ComponentManager] tab component creation successful");
            return true;
          } catch (error) {
            console.error(
              "[ComponentManager] tab component creation failed:",
              error
            );
            return false;
          }
        } else {
          console.warn("[ComponentManager] tab initialization failed:", {
            config: !!config,
            createTabComponent: typeof window.createTabComponent,
          });
          return false;
        }
      };

      // 여러 번 시도하여 안정성 확보
      const maxAttempts = 5;
      let attempts = 0;

      const tryInitialize = () => {
        attempts++;
        console.log(
          `[ComponentManager] tab initialization attempt ${attempts}/${maxAttempts}`
        );

        if (initializeTabs()) {
          console.log("[ComponentManager] tab initialization successful");
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(tryInitialize, 200 * attempts); // 점진적으로 지연 시간 증가
        } else {
          console.error(
            "[ComponentManager] tab initialization maximum attempt count exceeded"
          );
        }
      };

      setTimeout(tryInitialize, 100);
    }

    // 페이지 특정 초기화 이벤트 발생
    document.dispatchEvent(new CustomEvent("pageReady"));
  });
});

// 초기화 완료 로그
console.log(
  "[ComponentManager] initialization completed, component load event waiting"
);
