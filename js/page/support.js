/**
 * Support 페이지 보조 스크립트
 * tab.js와 함께 작동하여 support-02-news 페이지의 서브 탭 기능을 지원
 */

console.log("[Support] Support page script loaded");

// Support 페이지 전용 설정
document.addEventListener("DOMContentLoaded", function () {
  console.log("[Support] DOMContentLoaded - Support page initialization");

  // tab.js가 로드되기를 기다림
  const waitForTabSystem = () => {
    if (typeof window.createTabComponent === "function") {
      console.log("[Support] Tab system detected, Support setting applied");
      initializeSupportTabs();
    } else {
      console.log("[Support] Tab system waiting...");
      setTimeout(waitForTabSystem, 100);
    }
  };

  waitForTabSystem();
});

function initializeSupportTabs() {
  const currentPath = window.location.pathname;

  if (currentPath.includes("support-02-news")) {
    console.log("[Support] News page detected, subtab setting applied");

    // Support-02-News 전용 설정
    const supportNewsConfig = {
      mainTabs: [
        { id: "inquiry", text: "Contact us", isActive: false },
        { id: "news", text: "UROCK News", isActive: true },
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

    // 전역 설정 업데이트
    window.supportTabConfig = supportNewsConfig;

    // 탭 컨테이너가 로드되기를 기다림
    const waitForContainer = () => {
      const tabContainer = document.getElementById("tab-container");
      if (tabContainer && tabContainer.innerHTML.trim() !== "") {
        console.log("[Support] Tab container loaded, reinitialization");

        // 기존 초기화 상태 리셋
        tabContainer.dataset.tabInitialized = "false";

        // 재초기화
        if (typeof window.reInitTabComponent === "function") {
          window.reInitTabComponent("tab-container", supportNewsConfig);
        } else {
          window.createTabComponent("tab-container", supportNewsConfig);
        }
      } else {
        setTimeout(waitForContainer, 200);
      }
    };

    waitForContainer();
  }
}

// 탭 컨텐츠 로드 완료 이벤트 리스너
document.addEventListener("tabContentLoaded", function (event) {
  console.log("[Support] tab content loaded:", event.detail);

  // 추가적인 Support 페이지 전용 처리가 필요한 경우 여기에 추가
});

console.log("[Support] Support script initialization completed");

// Contact us 버튼 활성화 처리 (안전한 null 체크 추가)
const checkbox = document.querySelector(
  '.checkbox-wrapper input[type="checkbox"]'
);
const submit = document.getElementById("submit");

if (checkbox && submit) {
  console.log("[Support] Contact us form element found, event binding started");
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      submit.disabled = false;
    } else {
      submit.disabled = true;
    }
  });
} else {
  console.log(
    "[Support] Contact us form element not found, event binding skipped"
  );
}
