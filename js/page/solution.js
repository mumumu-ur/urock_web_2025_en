/**
 * 솔루션 및 지원 페이지 통합 JS
 * 모든 solution 페이지와 support 페이지의 공통 기능 및 개별 기능 관리
 */

// 솔루션 페이지 설정
const SOLUTION_PAGES = {
  "solution-01-dfas-pro": {
    id: "dfas-pro",
    mainTab: "dfas",
    text: "DFAS Pro",
    href: "/html/page/solution-01-dfas-pro.html",
  },
  "solution-02-dfas-ent": {
    id: "dfas-enterprise",
    mainTab: "dfas",
    text: "DFAS Enterprise",
    href: "/html/page/solution-02-dfas-ent.html",
  },
  "solution-03-mcq-p": {
    id: "mcq-p",
    mainTab: "mcq",
    text: "M-SecuManager P",
    href: "/html/page/solution-03-mcq-p.html",
  },
  "solution-04-mcq-s": {
    id: "mcq-s",
    mainTab: "mcq",
    text: "M-SecuManager S",
    href: "/html/page/solution-04-mcq-s.html",
  },
  "solution-05-mcq-g": {
    id: "mcq-g",
    mainTab: "mcq",
    text: "M-SecuManager G",
    href: "/html/page/solution-05-mcq-g.html",
  },
  "solution-06-gm": {
    id: "gm",
    mainTab: "gm",
    text: "GateManager",
    href: "/html/page/solution-06-gm.html",
  },
  "solution-07-gm-pro": {
    id: "gm-pro",
    mainTab: "gm",
    text: "GateManager Pro",
    href: "/html/page/solution-07-gm-pro.html",
  },
};

// 지원 페이지 설정
const SUPPORT_PAGES = {
  "support-01-inquiry": {
    id: "inquiry",
    text: "Contact us",
    href: "/html/page/support-01-inquiry.html",
  },
  "support-02-news": {
    id: "news",
    text: "UROCK News",
    href: "/html/page/support-02-news.html",
  },
};

// 솔루션 탭 설정 생성
function createSolutionTabConfig() {
  const currentPath = window.location.pathname;
  let activeMainTab = "dfas";
  let activeSubTab = null;

  // 현재 페이지에 따른 활성 탭 결정
  Object.entries(SOLUTION_PAGES).forEach(([pageKey, pageInfo]) => {
    if (currentPath.includes(pageKey) || currentPath.includes(pageInfo.id)) {
      activeMainTab = pageInfo.mainTab;
      activeSubTab = pageInfo.id;
    }
  });

  // activeSubTab이 설정되지 않은 경우 각 메인탭의 기본값 설정
  if (!activeSubTab) {
    switch (activeMainTab) {
      case "dfas":
        activeSubTab = "dfas-pro";
        break;
      case "mcq":
        activeSubTab = "mcq-p";
        break;
      case "gm":
        activeSubTab = "gm";
        break;
      default:
        activeSubTab = "dfas-pro"; // 전체 기본값
    }
    console.log(
      `[Solution] default subtab setting: ${activeMainTab} -> ${activeSubTab}`
    );
  }

  // 탭 설정 구성
  const mainTabs = [
    { id: "dfas", text: "DFAS", isActive: activeMainTab === "dfas" },
    { id: "mcq", text: "MCQ", isActive: activeMainTab === "mcq" },
    { id: "gm", text: "GateManager", isActive: activeMainTab === "gm" },
  ];

  const subTabs = {
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
        isActive:
          activeSubTab === "mcq-p" ||
          (activeMainTab === "mcq" && !activeSubTab),
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
  };

  return { mainTabs, subTabs };
}

// 지원 페이지 탭 설정 생성
function createSupportTabConfig() {
  const currentPath = window.location.pathname;

  let activeMainTab = "inquiry"; // 기본값
  if (currentPath.includes("support-02-news")) {
    activeMainTab = "news";
  }

  const mainTabs = [
    {
      id: "inquiry",
      text: "Contact us",
      isActive: activeMainTab === "inquiry",
    },
    {
      id: "news",
      text: "유락소식",
      isActive: activeMainTab === "news",
    },
  ];

  const subTabs = {
    inquiry: [],
    news: [],
  };

  return { mainTabs, subTabs };
}

// 공통 버튼 이벤트 설정
function setupCommonButtons() {
  // Solution inquiries 버튼
  const inquiryButtons = document.querySelectorAll(
    ".btn-solution, .btn .button"
  );
  inquiryButtons.forEach((button) => {
    if (!button.dataset.eventAttached) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "/html/page/support-01-inquiry.html";
      });
      button.dataset.eventAttached = "true";
    }
  });

  // View introduction materials 버튼
  const introButtons = document.querySelectorAll(".btn-introduction");
  introButtons.forEach((button) => {
    if (!button.dataset.eventAttached) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("View introduction materials button clicked");
        // 소개 자료 다운로드 또는 표시 로직 추가 가능
      });
      button.dataset.eventAttached = "true";
    }
  });
}

// 현재 페이지 타입 감지 (개선된 버전)
function getCurrentPageType() {
  const currentPath = window.location.pathname;
  console.log("[Solution] current path:", currentPath);

  const currentPageName = currentPath.split("/").pop().replace(".html", "");
  console.log("[Solution] current file name:", currentPageName);

  // 솔루션 페이지 확인
  const solutionPageType = Object.keys(SOLUTION_PAGES).find((pageKey) => {
    return (
      currentPageName === pageKey ||
      currentPageName === SOLUTION_PAGES[pageKey].id
    );
  });

  if (solutionPageType) {
    console.log(`[Solution] solution page type detected: ${solutionPageType}`);
    return { type: "solution", page: solutionPageType };
  }

  // 지원 페이지 확인
  const supportPageType = Object.keys(SUPPORT_PAGES).find((pageKey) => {
    return currentPageName === pageKey;
  });

  if (supportPageType) {
    console.log(`[Solution] support page type detected: ${supportPageType}`);
    return { type: "support", page: supportPageType };
  }

  // 서비스 페이지 확인
  if (currentPageName === "service-01-analysis") {
    console.log("[Solution] service page type detected: service-01-analysis");
    return { type: "service", page: "service-01-analysis" };
  }

  console.log("[Solution] unknown page type");
  return null;
}

// Contact us 페이지 초기화
function initSupportInquiry() {
  console.log("[Support] Contact us page initialized");

  // 페이지네이션 초기화
  initInquiryPagination();

  // 문의 등록 폼 초기화
  initInquiryForm();

  console.log("[Support] Contact us page initialized");
}

// 뉴스 페이지 초기화
function initSupportNews() {
  console.log("[Support] news page initialized");

  // 검색 기능 초기화
  initSearchFunction();

  // 필터 기능 초기화
  initFilterFunction();

  // 페이지네이션 초기화
  initNewsPagination();

  console.log("[Support] news page initialized");
}

// Contact us 페이지네이션
function initInquiryPagination() {
  const pagination = document.querySelector(".pagination");

  // 페이지네이션 요소가 존재하는지 확인
  if (!pagination) {
    console.log("pagination element not found");
    return;
  }

  const links = pagination.querySelectorAll(".pagination__link");
  const prevBtn = pagination.querySelector(".pagination__prev");
  const nextBtn = pagination.querySelector(".pagination__next");

  let currentPage = 1;
  const totalPages = 20;

  // 초기 페이지 활성화 설정
  function initializeActivePage() {
    // 첫 번째 페이지 링크를 기본적으로 활성화
    const firstPageLink = document.querySelector(".pagination__link");
    if (firstPageLink) {
      firstPageLink.classList.add("active");
    }
  }

  // 페이지 링크 클릭 이벤트
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // 현재 활성 페이지 제거
      const currentActiveLink = document.querySelector(
        ".pagination__link.active"
      );
      if (currentActiveLink) {
        currentActiveLink.classList.remove("active");
      }

      // 클릭된 페이지 활성화
      e.target.classList.add("active");
      currentPage = parseInt(e.target.textContent);

      // 페이지 변경 로직 (예: 데이터 로딩)
      loadPageData(currentPage);
    });
  });

  // 이전 페이지 버튼
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
      }
    });
  }

  // 다음 페이지 버튼
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
      }
    });
  }

  // 페이지네이션 상태 업데이트
  function updatePagination() {
    // 현재 활성 페이지 링크 제거
    const currentActiveLink = document.querySelector(
      ".pagination__link.active"
    );
    if (currentActiveLink) {
      currentActiveLink.classList.remove("active");
    }

    // 새로운 현재 페이지 활성화
    const newCurrentLink = document.querySelector(
      `.pagination__link:nth-child(${currentPage})`
    );
    if (newCurrentLink) {
      newCurrentLink.classList.add("active");
    }

    // 페이지 데이터 로딩
    loadPageData(currentPage);
  }

  // 페이지 데이터 로딩 함수 (예시)
  function loadPageData(page) {
    console.log(`page ${page} data loading...`);
    // 여기에 실제 데이터 로딩 로직 구현
  }

  // 초기 페이지 설정
  initializeActivePage();
}

// 문의 등록 폼 초기화
function initInquiryForm() {
  // jQuery가 로드되지 않은 경우 경고 메시지 출력
  if (typeof $ === "undefined") {
    console.warn("jQuery is not loaded. Some features may be limited.");
    return;
  }

  var prev_first = "선택하세요";
  var prev_second = "선택하세요";
  var prev_third = "선택하세요";
  var isChanged = false;

  $(".tab-inquiry").on("click", function () {
    // Potential tab-related functionality can be added here
  });

  $("select[name='inquiry-type']")
    .on("mousedown", function () {
      prev_first = $(this).val();
    })
    .change(function () {
      var selectedValue = $(this).val();

      $(".selt002").prop("disabled", false);
      var secondSelect = $("select[name='second']");
      var thirdSelect = $("select[name='third']");

      prev_second = secondSelect.val();
      prev_third = thirdSelect.val();

      secondSelect.children().remove();
      secondSelect.append('<option value="Select">Select</option>');
      thirdSelect.children().remove();
      thirdSelect.append('<option value="Select">Select</option>');

      // 변화 감지
      if (prev_first != selectedValue) {
        isChanged = true;
        if (
          prev_first == "Technical Support" ||
          (selectedValue == "Technical Support" && prev_first != "Select")
        ) {
          isChanged = confirm(
            "Changing the inquiry type may reset the form.\nDo you want to proceed?"
          );
          if (isChanged) {
            $("#details").summernote("code", "");
          } else {
            $(this).val(prev_first);
            selectedValue = $(this).val();
          }
        }
      } else {
        isChanged = false;
      }

      if (selectedValue == "Select") {
        $(".sol-tr").show();
        $(".selt002, .selt003").show().prop("disabled", true);
      }

      if (selectedValue == "Solution Inquiry") {
        $(".sol-tr").show();
        $(".selt002").show().prop("disabled", false);
        $(".selt003").show().prop("disabled", true);
        secondSelect.append(
          '<option value="M-SecuManager">M-SecuManager</option>'
        );
        secondSelect.append(
          '<option value="Digital Forensics">Digital Forensics</option>'
        );
        secondSelect.append(
          '<option value="Security Control System">Security Control System</option>'
        );
        secondSelect.append(
          '<option value="Business Support System">Business Support System</option>'
        );
      }

      if (selectedValue == "Technical Support") {
        $(".sol-tr").show();
        $(".selt002").show().prop("disabled", false);
        $(".selt003").show().prop("disabled", true);
        secondSelect.append(
          '<option value="M-SecuManager">M-SecuManager</option>'
        );
        secondSelect.append(
          '<option value="Digital Forensics">Digital Forensics</option>'
        );
        secondSelect.append(
          '<option value="Security Control System">Security Control System</option>'
        );
        secondSelect.append(
          '<option value="Business Support System">Business Support System</option>'
        );

        if (prev_first != "Technical Support") {
          $("#details").summernote(
            "code",
            "<p><b>[Product Information]</b></p><p><b>Product Version</b> :</p><p><b>Usage Environment</b> : (OS, Memory, File System, Security Program Installation Status, etc.)</p><br/><br/><p><b>Detailed Symptoms</b></p><p>(Related Function, Description of Occurrence, Settings, Security Program Installation Status)</p><br/><br/><br/><p><b>Screenshot</b></p><p>(Image Insertion)</p>"
          );
        }
      }

      if (selectedValue == "Service Inquiry") {
        $(".sol-tr").show();
        $(".selt002").show().prop("disabled", false);
        $(".selt003").show().prop("disabled", true);
        secondSelect.append(
          '<option value="Digital Forensic Consulting">Digital Forensic Consulting</option>'
        );
        secondSelect.append(
          '<option value="Digital Forensic Education">Digital Forensic Education</option>'
        );
        secondSelect.append(
          '<option value="Data Deletion Center">Data Deletion Center</option>'
        );
      }

      if (selectedValue == "Other Inquiry") {
        $(".sol-tr").hide();
        $(".selt002, .selt003, .selt004").hide();
        secondSelect.children().remove();
        secondSelect.append('<option value=""></option>');
        thirdSelect.children().remove();
        thirdSelect.append('<option value=""></option>');
      }

      if (!isChanged) {
        secondSelect.val(prev_second);
        secondSelect.trigger("change");
      } else {
        secondSelect.val("Select");
      }
    });

  $("select[name='second']").change(function () {
    $(".selt003").prop("disabled", false);
    var thirdSelect = $("select[name='third']");
    var selectedValue = $(this).val();

    thirdSelect.children().remove();
    thirdSelect.append('<option value="Select">Select</option>');

    if (selectedValue == "Select") {
      $(".selt003").show().prop("disabled", true);
    }

    if (selectedValue == "M-SecuManager") {
      thirdSelect.append(
        '<option value="M-SecuManager S">M-SecuManager S</option>'
      );
      thirdSelect.append(
        '<option value="M-SecuManager G">M-SecuManager G</option>'
      );
    }

    if (selectedValue == "Digital Forensics") {
      thirdSelect.append(
        '<option value="F-SecuManager">F-SecuManager</option>'
      );
      thirdSelect.append('<option value="DFAS Pro">DFAS Pro</option>');
      thirdSelect.append(
        '<option value="DFAS Enterprise">DFAS Enterprise</option>'
      );
    }

    if (selectedValue == "Security Control System") {
      thirdSelect.append('<option value="GateManager">GateManager</option>');
    }

    if (selectedValue == "Business Support System") {
      thirdSelect.append('<option value="D-Trans">D-Trans</option>');
    }

    if (selectedValue == "Digital Forensic Consulting") {
      $(".selt003").show().prop("disabled", false);
      thirdSelect.append(
        '<option value="Digital Forensic Analysis Service">Digital Forensic Analysis Service</option>'
      );
      thirdSelect.append(
        '<option value="Digital Forensic Lab Construction">Digital Forensic Lab Construction</option>'
      );
      thirdSelect.append(
        '<option value="International Certification">International Certification</option>'
      );
    }

    if (
      selectedValue == "Digital Forensic Education" ||
      selectedValue == "Data Deletion Center"
    ) {
      $(".selt003").hide().prop("disabled", true);
      thirdSelect.children().remove();
      thirdSelect.append('<option value=""></option>');
    }

    if (!isChanged) thirdSelect.val(prev_third);
  });

  // 이메일 도메인 선택
  function setEmailDomain(arg) {
    if (arg == "direct") {
      $("#email2").val("");
      $("#email2").show();
    } else {
      $("#email2").val("");
      $("#email2").hide();
    }
  }

  // 문의 등록
  function submitInquiry() {
    // 유효성 검사 로직 (기존 코드와 유사)
    if ($("#email1").val() == "" || $("#email1").val().length < 3) {
      alert("Please enter the email address you want to receive a reply.");
      $("#email1").focus();
      return;
    }

    // 추가적인 유효성 검사 로직들...

    if (confirm("Do you want to register the content you wrote?")) {
      // AJAX 제출 로직
      $.ajax({
        type: "POST",
        url: "/_ajax/_ajax.regQueProc.php",
        cache: false,
        dataType: "json",
        data: {
          mode: "regQueCont",
          "inquiry-type": $("#inquiry-type").val(),
          second: $(".selt002").val(),
          third: $(".selt003").val(),
          company: $("#company").val(),
          name: $("#name").val(),
          phone: $("#phone").val(),
          email1: $("#email1").val(),
          email2: $("#email2").val(),
          email3: $("#email3").val(),
          details: encodeURIComponent($("#details").val()),
        },
      })
        .done(function (ajaxData) {
          if (ajaxData == "success") {
            alert(
              "The registration was successful.\nWe will respond as soon as possible."
            );
            window.location.replace("support_ok.php");
          } else {
            alert(
              "The processing was not successful.\nPlease try again.\nIf the error persists, please contact the operation team."
            );
          }
        })
        .fail(function () {
          alert(
            "The processing was not successful.\nPlease try again.\nIf the error persists, please contact the operation team."
          );
        });
    }
  }

  // 취소
  function resetInquiry() {
    window.location.replace("/kr");
  }

  // 폼 제출 이벤트 핸들러
  $("form").on("submit", function (e) {
    e.preventDefault();
    submitInquiry();
  });
}

// 뉴스 페이지 검색 기능
function initSearchFunction() {
  const searchForm = document.querySelector(".search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchInput = document.querySelector("#search-input");
      const searchTerm = searchInput.value.trim();

      if (searchTerm) {
        console.log("[News] search term:", searchTerm);
        // 검색 로직 구현
      }
    });
  }
}

// 뉴스 페이지 필터 기능
function initFilterFunction() {
  const tagContainer = document.querySelector(".tag-container");
  if (tagContainer) {
    const tagLinks = tagContainer.querySelectorAll("a");
    tagLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // 모든 태그에서 active 클래스 제거
        tagLinks.forEach((tag) => tag.classList.remove("active"));

        // 클릭된 태그에 active 클래스 추가
        this.classList.add("active");

        const category = this.textContent.trim();
        console.log("[News] selected category:", category);
        // 필터링 로직 구현
      });
    });
  }
}

// 뉴스 페이지 페이지네이션
function initNewsPagination() {
  const paginationLinks = document.querySelectorAll(".pagination__link");
  paginationLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageNumber = this.textContent.trim();
      console.log("[News] page move:", pageNumber);
      // 페이지네이션 로직 구현
    });
  });
}

// 페이지별 특별 기능 초기화 (안전한 실행)
function initializePageFeatures(pageInfo) {
  if (!pageInfo) {
    console.warn(
      "[Solution] page information is not found. Only basic features are set."
    );

    // 기본 기능들은 항상 설정
    try {
      setupCommonButtons();
    } catch (error) {
      console.error("[Solution] error in setting basic features:", error);
    }
    return;
  }

  const { type, page } = pageInfo;
  console.log(`[Solution] page initialization: ${type} - ${page}`);

  // 공통 기능 설정 (안전한 실행)
  try {
    setupCommonButtons();
  } catch (error) {
    console.error("[Solution] error in setting common features:", error);
  }

  // 타입별 특별한 기능 초기화
  try {
    if (type === "solution") {
      // 솔루션 페이지별 초기화
      const solutionInfo = SOLUTION_PAGES[page];
      if (solutionInfo) {
        console.log(
          `[Solution] ${solutionInfo.text} special feature initialization`
        );
        // 각 솔루션별 특별한 기능이 있다면 여기에 추가
      }
    } else if (type === "support") {
      // 지원 페이지별 초기화
      if (page === "support-01-inquiry") {
        initSupportInquiry();
      } else if (page === "support-02-news") {
        initSupportNews();
      }
    }
  } catch (error) {
    console.error(
      `[Solution] error in setting special features: ${type}-${page}`,
      error
    );
  }
}

// 메인 초기화 함수
function initSolutionPage() {
  console.log("[Solution] solution and support page script loaded");

  // 현재 페이지 타입에 맞는 초기화
  const pageInfo = getCurrentPageType();

  if (pageInfo && pageInfo.type === "solution") {
    // 솔루션 탭 설정 생성 및 전역 변수 설정
    window.solutionTabConfig = createSolutionTabConfig();
    window.pageTabConfig = window.solutionTabConfig;

    // 레거시 호환성을 위한 활성 탭 정보 저장
    const currentPath = window.location.pathname;
    let activeMainTab = "dfas";
    let activeSubTab = null;

    Object.entries(SOLUTION_PAGES).forEach(([pageKey, pageData]) => {
      if (currentPath.includes(pageKey) || currentPath.includes(pageData.id)) {
        activeMainTab = pageData.mainTab;
        activeSubTab = pageData.id;
      }
    });

    window.activeSolutionTab = {
      mainTab: activeMainTab,
      subTab: activeSubTab,
    };

    console.log(
      `[Solution] current page: ${currentPath}, active tab: ${activeMainTab} / ${activeSubTab}`
    );
  } else if (pageInfo && pageInfo.type === "support") {
    // 지원 페이지 탭 설정 생성 및 전역 변수 설정
    window.pageTabConfig = createSupportTabConfig();
    console.log(`[Support] current page: ${window.location.pathname}`);
  }

  // 페이지별 특별 기능 초기화
  initializePageFeatures(pageInfo);
}

// 컴포넌트 모두 로드 후 실행
// allComponentsLoaded 이벤트는 componentManager에서 처리하므로 제거

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initSolutionPage);

// 전역에서 접근 가능하도록 함수들을 window 객체에 추가
window.initSolutionPage = initSolutionPage;
window.initSupportInquiry = initSupportInquiry;
window.initSupportNews = initSupportNews;
