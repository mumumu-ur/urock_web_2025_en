// 전역 상수 정의
export const CONSTANTS = {
  // API 관련 상수
  API: {
    BASE_URL: "",
    TIMEOUT: 5000,
  },

  // UI 관련 상수
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
  },

  // 경로 관련 상수
  PATHS: {
    IMAGES: "images/",
    ICONS: "/icons/",
    LOGO: "/logo/",
  },

  // 색상 관련 상수
  COLORS: {
    primary: "#007bff",
    danger: "#dc3545",
    success: "#28a745",
  },

  // 메시지 관련 상수 (utils/constants.js 병합)
  MESSAGES: {
    ERROR: {
      NETWORK: "A network error occurred. Please try again.",
      UNKNOWN: "An unknown error occurred.",
    },
    SUCCESS: {
      SUBMIT: "Successfully submitted.",
    },
    error: "An error occurred. Please try again.",
    success: "Successfully processed.",
  },

  // 환경설정 관련 상수 (config.js 병합)
  CONFIG: {
    API_BASE_URL: "https://api.example.com",
    DEBUG_MODE: true,
  },
};

// 기본 내보내기
export default CONSTANTS;
