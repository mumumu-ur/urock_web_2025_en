// 자주 사용하는 함수들 (ex. 날짜 포맷, 숫자 포맷 등)

// 공통 유틸 함수 모음

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0];
}

/**
 * 숫자에 콤마 추가
 */
export function addComma(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 디바운스 함수
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 쿼리 파라미터를 객체로 변환
 */
export function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const queries = queryString.split("&");

  queries.forEach((query) => {
    const [key, value] = query.split("=");
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
  });

  return params;
}

/**
 * 상대 경로 변환 함수 (개선된 버전)
 * @param {string} absPath - 변환할 절대 경로
 * @returns {string} - 현재 페이지에서 접근 가능한 상대 경로
 */
export function toRelativePath(absPath) {
  // 이미 상대 경로인 경우 그대로 반환
  if (!absPath.startsWith("/")) {
    return absPath;
  }

  // 현재 페이지의 경로 분석
  const currentPath = window.location.pathname;

  // 현재 경로의 깊이 계산 (더 정확한 방법)
  let depth = 0;
  if (currentPath !== "/" && currentPath !== "/index.html") {
    const pathParts = currentPath.split("/").filter((part) => part.length > 0);
    // 마지막이 .html 파일이면 그것을 제외하고 계산
    if (
      pathParts.length > 0 &&
      pathParts[pathParts.length - 1].includes(".html")
    ) {
      depth = pathParts.length - 1;
    } else {
      depth = pathParts.length;
    }
  }

  // 상대 경로 생성
  const relativePrefix = depth > 0 ? "../".repeat(depth) : "./";
  const relativePath = relativePrefix + absPath.replace(/^\//, "");

  console.log(
    `[Utils] path conversion: ${absPath} → ${relativePath} (depth: ${depth}, current: ${currentPath})`
  );

  return relativePath;
}

/**
 * 절대 경로를 현재 페이지 기준으로 정규화
 * @param {string} path - 정규화할 경로
 * @returns {string} - 정규화된 절대 경로
 */
export function normalizePath(path) {
  // 이미 절대 경로인 경우
  if (path.startsWith("/")) {
    return path;
  }

  // 현재 페이지의 디렉토리 경로
  const currentPath = window.location.pathname;
  const currentDir = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);

  // 상대 경로를 절대 경로로 변환
  let absolutePath = currentDir + path;

  // 경로 정규화
  absolutePath = absolutePath.replace(/\/\.\//g, "/"); // ./를 제거

  // ../를 처리
  while (absolutePath.includes("../")) {
    absolutePath = absolutePath.replace(/\/[^\/]+\/\.\.\//g, "/");
  }

  // 중복 슬래시 제거
  absolutePath = absolutePath.replace(/\/+/g, "/");

  return absolutePath;
}
