// Contact us 체크박스 활성화/비활성화 함수 (동적으로 폼이 삽입된 후 호출 필요)
function initSupportCheckboxButton() {
  const checkbox = document.querySelector(
    '.checkbox-wrapper input[type="checkbox"]'
  );
  const label = document.getElementById("checkbox-label");
  const submitButton = document.getElementById("submit");
  if (!checkbox || !label || !submitButton) return;

  // 초기 상태
  submitButton.disabled = !checkbox.checked;

  // change 이벤트에서만 버튼 활성화/비활성화 처리 (체크박스, label 클릭 모두 반영)
  checkbox.addEventListener("change", function () {
    submitButton.disabled = !checkbox.checked;
  });

  // label 클릭 시 버튼 상태 갱신 (브라우저 기본 동작 후 상태 반영)
  label.addEventListener("click", function () {
    setTimeout(() => {
      submitButton.disabled = !checkbox.checked;
    }, 0);
  });
}
window.initSupportCheckboxButton = initSupportCheckboxButton;

// 문의 유형에 따른 옵션 데이터
const inquiryOptions = {
  solution: [
    { value: "dfas-pro", text: "DFAS Pro" },
    { value: "dfas-enterprise", text: "DFAS Enterprise" },
    { value: "msecumanager-p", text: "M-SecuManager P" },
    { value: "msecumanager-s", text: "M-SecuManager S" },
    { value: "msecumanager-g", text: "M-SecuManager G" },
    { value: "gate-manager", text: "GateManager" },
    { value: "gate-manager-pro", text: "GateManager Pro" },
  ],
  technical: [
    { value: "dfas-pro", text: "DFAS Pro" },
    { value: "dfas-enterprise", text: "DFAS Enterprise" },
    { value: "msecumanager-p", text: "M-SecuManager P" },
    { value: "msecumanager-s", text: "M-SecuManager S" },
    { value: "msecumanager-g", text: "M-SecuManager G" },
    { value: "gate-manager", text: "GateManager" },
    { value: "gate-manager-pro", text: "GateManager Pro" },
  ],
  service: [
    { value: "forensic-analysis", text: "Forensic Analysis Service" },
    {
      value: "international-certification",
      text: "International Standardization Certification",
    },
    { value: "forensic-education", text: "Forensic Education" },
  ],
  other: [{ value: "other", text: "Other" }],
};

// 문의 유형 선택에 따른 동적 변경 함수
function initInquiryTypeSelection() {
  const type1Select = document.getElementById("inquiry-type-1");
  const type2Select = document.getElementById("inquiry-type-2");

  if (!type1Select || !type2Select) return;

  // 유형 2 select 초기화 함수
  function resetType2Select() {
    type2Select.innerHTML =
      '<option value="" disabled selected>Select Inquiry Type</option>';
  }

  // select 요소의 텍스트 색상 변경 함수
  function updateSelectColor(selectElement) {
    if (selectElement.value) {
      selectElement.style.color = "#FFF";
    } else {
      selectElement.style.color = "";
    }
  }

  // 유형 1 변경 시 이벤트 처리
  type1Select.addEventListener("change", function () {
    const selectedValue = this.value;

    // 유형 1 텍스트 색상 변경
    updateSelectColor(this);

    // 유형 2 초기화
    resetType2Select();

    if (selectedValue === "other") {
      // 기타 문의 선택 시
      type2Select.disabled = false;
      type2Select.style.opacity = "";
      type2Select.style.cursor = "";

      // 기타 옵션 추가
      inquiryOptions[selectedValue].forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        type2Select.appendChild(optionElement);
      });
    } else if (inquiryOptions[selectedValue]) {
      // 솔루션 문의, 기술지원, 서비스 문의 선택 시
      type2Select.disabled = false;
      type2Select.style.opacity = "";
      type2Select.style.cursor = "";

      // 해당하는 옵션들 추가
      inquiryOptions[selectedValue].forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        type2Select.appendChild(optionElement);
      });
    }
  });

  // 유형 2 변경 시 이벤트 처리
  type2Select.addEventListener("change", function () {
    // 유형 2 텍스트 색상 변경
    updateSelectColor(this);
  });

  // 초기 상태 설정
  type2Select.disabled = true;
}

// 폼 유효성 검사 함수
function validateContactForm(form) {
  const requiredFields = [
    { field: form.querySelector("#name"), name: "Name" },
    { field: form.querySelector("#company"), name: "Company" },
    { field: form.querySelector("#phone"), name: "Phone" },
    { field: form.querySelector("#email"), name: "Email" },
    { field: form.querySelector("#inquiry-type-1"), name: "Inquiry Type 1" },
    { field: form.querySelector("#details"), name: "Inquiry Details" },
  ];

  for (const { field, name } of requiredFields) {
    if (!field || !field.value.trim()) {
      alert(`Please enter ${name}.`);
      if (field) field.focus();
      return false;
    }
  }

  // 이메일 형식 검증
  const email = form.querySelector("#email").value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    form.querySelector("#email").focus();
    return false;
  }

  // 전화번호 형식 검증
  const phone = form.querySelector("#phone").value;
  const phoneRegex = /^(010|011|016|017|018|019)-?[0-9]{3,4}-?[0-9]{4}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    alert("Please enter a valid phone number. (e.g. 010-1234-5678)");
    form.querySelector("#phone").focus();
    return false;
  }

  // 개인정보 동의 확인
  const checkbox = form.querySelector('input[type="checkbox"]');
  if (!checkbox || !checkbox.checked) {
    alert("Please agree to the personal information collection and use.");
    return false;
  }

  return true;
}

// EmailJS 라이브러리 동적 로딩 함수
async function loadEmailJSLibrary() {
  console.log("[EmailJS] loading library...");

  // 기존 EmailJS 스크립트 모두 제거 (캐시 문제 해결)
  document.querySelectorAll('script[src*="emailjs"]').forEach((script) => {
    console.log("[EmailJS] removing existing script:", script.src);
    script.remove();
  });

  // EmailJS 객체 초기화
  if (window.emailjs) {
    console.log("[EmailJS] resetting existing emailjs object");
    window.emailjs = undefined;
  }

  try {
    // 강제로 새 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js?v=" +
      Date.now(); // 캐시 방지
    script.type = "text/javascript";

    console.log("[EmailJS] loading new script:", script.src);

    // 스크립트 로딩 Promise
    const loadPromise = new Promise((resolve, reject) => {
      script.onload = () => {
        console.log("[EmailJS] script loaded successfully");
        resolve();
      };
      script.onerror = (error) => {
        console.error("[EmailJS] script load failed:", error);
        reject(error);
      };
    });

    document.head.appendChild(script);
    await loadPromise;

    // EmailJS 객체 로딩 대기 (최대 10초)
    for (let i = 0; i < 100; i++) {
      if (window.emailjs && typeof window.emailjs.init === "function") {
        console.log(
          "[EmailJS] ✅ library loaded successfully, version:",
          window.emailjs.version || "v4+"
        );
        return window.emailjs;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    throw new Error("EmailJS object loading timeout");
  } catch (error) {
    console.error("[EmailJS] ❌ library loading failed:", error);
    return null;
  }
}

// EmailJS 폼 초기화 함수 (동적으로 폼이 삽입된 후 호출 필요)
export async function initEmailJSForm() {
  console.log("[EmailJS] initialization started...");

  // EmailJS 라이브러리 동적 로딩
  const emailjsLib = await loadEmailJSLibrary();
  if (!emailjsLib) {
    console.error("[EmailJS] emailjs library loading failed");
    return;
  }

  // EmailJS 초기화
  try {
    emailjsLib.init("1UO_ymkYuv_ECqtLQ");
    console.log("[EmailJS] ✅ initialization completed");
  } catch (error) {
    console.error("[EmailJS] ❌ initialization failed:", error);
    return;
  }

  const form = document.querySelector(".contents form");
  if (!form) {
    console.warn("[EmailJS] ⚠️ form element not found");
    return;
  }

  console.log("[EmailJS] 📝 form element found, event listener registered");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("[EmailJS] 📤 form submission started...");

    // 폼 유효성 검사
    if (!validateContactForm(form)) {
      console.log("[EmailJS] ❌ form validation failed");
      return;
    }

    // 제출 버튼 비활성화 (중복 제출 방지)
    const submitButton = form.querySelector("#submit");
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    // 폼 데이터를 객체로 변환 및 로깅
    const formData = new FormData(form);
    const templateParams = {};

    console.log("[EmailJS] 📊 submission data:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
      templateParams[key] = value;
    }

    // EmailJS로 메일 전송 (재시도 로직 포함)
    async function sendEmailWithRetry(retryCount = 0) {
      try {
        const response = await emailjsLib.send(
          "service_tptbrq7",
          "template_1ukblmg",
          templateParams
        );
        console.log("[EmailJS] ✅ email sent successfully:", response);
        alert(
          "Your inquiry has been successfully submitted!\nWe will respond to you soon."
        );

        // 폼 리셋
        form.reset();

        // UI 상태 초기화
        const type2Select = document.getElementById("inquiry-type-2");
        const type1Select = document.getElementById("inquiry-type-1");
        if (type2Select) {
          type2Select.disabled = true;
          type2Select.style.opacity = "";
          type2Select.style.cursor = "";
          type2Select.style.color = "";
        }
        if (type1Select) {
          type1Select.style.color = "";
        }

        // 체크박스 상태 초기화
        const checkbox = form.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = false;
        }

        // 제출 버튼 상태 복원
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // 중복 제출 방지 해제
        isSubmitting = false;
      } catch (error) {
        console.error("[EmailJS] ❌ email sending failed:", error);

        // SMTP 연결 시간 초과인 경우 재시도
        if (
          error.status === 412 &&
          error.text &&
          error.text.includes("timeout") &&
          retryCount < 2
        ) {
          console.log(
            `[EmailJS] 🔄 SMTP connection timeout, retrying in ${
              3 + retryCount * 2
            } seconds... (${retryCount + 1}/3)`
          );
          setTimeout(() => {
            sendEmailWithRetry(retryCount + 1);
          }, (3 + retryCount * 2) * 1000);
          return;
        }

        // 재시도 횟수 초과 또는 다른 에러
        let errorMessage = "Email sending failed.";
        if (error.status === 412) {
          errorMessage +=
            "\nThere is a problem with the server connection. Please try again later.";
        } else if (error.status === 400) {
          errorMessage += "\nPlease check your input information.";
        } else if (error.status === 403) {
          errorMessage += "\nThere is a permission problem.";
        }

        alert(errorMessage);

        // 제출 버튼 상태 복원
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        // 중복 제출 방지 해제
        isSubmitting = false;
      }
    }

    // 재시도 함수 실행
    sendEmailWithRetry();
  });

  console.log("[EmailJS] 🎯 form event listener registered");
}

// allComponentsLoaded 이벤트 발생 시 자동으로 함수들 호출
if (typeof window !== "undefined") {
  document.addEventListener("allComponentsLoaded", async () => {
    console.log("[EmailJS] 🔄 allComponentsLoaded event detected");
    initSupportCheckboxButton();
    initInquiryTypeSelection();
    await initEmailJSForm();
  });

  // DOM이 로드된 후에도 한번 더 실행
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("[EmailJS] 🔄 DOMContentLoaded event detected");
    initSupportCheckboxButton();
    initInquiryTypeSelection();
    await initEmailJSForm();
  });

  // 탭 컨텐츠 로드 시마다 초기화 함수들 실행
  document.addEventListener("tabContentLoaded", async () => {
    console.log("[EmailJS] 🔄 tabContentLoaded event detected");
    setTimeout(async () => {
      initSupportCheckboxButton();
      initInquiryTypeSelection();
      await initEmailJSForm();
    }, 100);
  });

  // 추가 안전장치: 주기적 체크
  let emailCheckInterval = setInterval(async () => {
    const form = document.querySelector(".contents form");
    if (form && !form.hasAttribute("data-emailjs-initialized")) {
      console.log(
        "[EmailJS] 🔄 periodic check found form, initialization attempt"
      );
      form.setAttribute("data-emailjs-initialized", "true");
      initSupportCheckboxButton();
      initInquiryTypeSelection();
      await initEmailJSForm();
    }
  }, 2000);

  // 10초 후 인터벌 정리
  setTimeout(() => {
    clearInterval(emailCheckInterval);
  }, 10000);

  // EmailJS 테스트 함수 (개발/테스트용)
  let isTestRunning = false;
  window.testEmailJS = async function () {
    if (isTestRunning) {
      console.log("[EmailJS Test] ⚠️ test already running");
      return;
    }

    isTestRunning = true;
    console.log("[EmailJS Test] 🧪 test started...");

    // EmailJS 라이브러리 동적 로딩
    const emailjsLib = await loadEmailJSLibrary();
    if (!emailjsLib) {
      console.error("[EmailJS Test] ❌ EmailJS library loading failed");
      return;
    }

    // EmailJS 초기화
    try {
      emailjsLib.init("1UO_ymkYuv_ECqtLQ");
    } catch (error) {
      console.error("[EmailJS Test] ❌ initialization failed:", error);
    }

    // 테스트 데이터
    const testData = {
      name: "Test User",
      company: "(주)테스트",
      phone: "010-1234-5678",
      email: "test@test.com",
      "inquiry-type-1": "solution",
      "inquiry-type-2": "dfas-pro",
      details: "This is an EmailJS test email.",
    };

    console.log("[EmailJS Test] 📊 test data:", testData);

    // EmailJS 직접 호출 테스트
    try {
      const response = await emailjsLib.send(
        "service_tptbrq7",
        "template_1ukblmg",
        testData
      );
      console.log("[EmailJS Test] ✅ test email sent successfully!", response);
      alert("✅ EmailJS test successful!\nTest email has been sent.");
    } catch (error) {
      console.error("[EmailJS Test] ❌ test email sending failed:", error);
      alert("❌ EmailJS test failed!\n" + JSON.stringify(error));
    } finally {
      isTestRunning = false;
    }
  };

  // EmailJS 상태 확인 함수
  window.checkEmailJSStatus = function () {
    console.log("[EmailJS Status] 📋 checking status...");

    const status = {
      library: typeof window.emailjs !== "undefined",
      form: !!document.querySelector(".contents form"),
      initialized: !!document.querySelector(
        ".contents form[data-emailjs-initialized]"
      ),
      checkbox: !!document.querySelector(
        '.checkbox-wrapper input[type="checkbox"]'
      ),
      submitButton: !!document.getElementById("submit"),
    };

    console.table(status);

    if (status.library && status.form) {
      console.log("✅ EmailJS base environment is normal");
    } else {
      console.warn("⚠️ EmailJS environment has a problem.");
    }

    return status;
  };
}
