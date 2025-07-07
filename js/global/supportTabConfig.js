/**
 * Support 페이지 탭 설정
 */
function createSupportTabConfig() {
  const currentPath = window.location.pathname;
  console.log("[SupportTabConfig] current path:", currentPath);

  // 현재 페이지에 따른 활성 탭 결정
  let activeMainTab = "inquiry"; // 기본값
  if (currentPath.includes("support-02-news")) {
    activeMainTab = "news";
  }

  console.log("[SupportTabConfig] active main tab:", activeMainTab);

  const config = {
    mainTabs: [
      {
        id: "inquiry",
        text: "Contact us",
        isActive: activeMainTab === "inquiry",
      },
      { id: "news", text: "UROCK News", isActive: activeMainTab === "news" },
    ],
    subTabs: {
      // support 페이지는 서브탭이 없음
    },
  };

  console.log("[SupportTabConfig] created config:", config);
  return config;
}

// 동적으로 설정 생성 및 전역 노출
console.log("[SupportTabConfig] starting config creation");
window.supportTabConfig = createSupportTabConfig();
console.log(
  "[SupportTabConfig] global config registered:",
  window.supportTabConfig
);

// 설정이 제대로 등록되었는지 확인
setTimeout(() => {
  console.log(
    "[SupportTabConfig] 1 second later global config check:",
    window.supportTabConfig
  );
}, 1000);

// 디버깅을 위한 테스트 함수만 유지
window.testSupportTab = function () {
  console.log("=== Support Tab debugging information ===");
  console.log("1. supportTabConfig exists:", !!window.supportTabConfig);
  console.log("2. supportTabConfig content:", window.supportTabConfig);
  console.log(
    "3. tab-container 존재:",
    !!document.getElementById("tab-container")
  );
  console.log(
    "4. createTabComponent 함수 존재:",
    typeof window.createTabComponent
  );
  console.log("5. current path:", window.location.pathname);

  const container = document.getElementById("tab-container");
  if (container) {
    console.log("6. container HTML:", container.innerHTML);
    console.log(
      "7. container initialization state:",
      container.dataset.tabInitialized
    );
  }

  // 강제 초기화 시도
  if (
    window.supportTabConfig &&
    typeof window.createTabComponent === "function"
  ) {
    console.log("8. forced initialization attempt");
    window.createTabComponent("tab-container", window.supportTabConfig);
  }
};
