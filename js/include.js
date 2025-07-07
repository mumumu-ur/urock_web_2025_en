/**
 * HTML 컴포넌트 동적 삽입 스크립트 (Fetch API 기반)
 *
 * data-include-path 속성을 가진 요소의 내용을 해당 경로의 HTML 파일로 대체하고,
 * 컴포넌트 로드 완료 시 이벤트를 발생시킵니다.
 *
 * 사용법: <div data-include-path="/path/to/component.html"></div>
 */

/**
 * 경로를 현재 페이지에서 절대 경로로 변환
 * @param {string} path - 변환할 경로
 * @returns {string} - 정규화된 절대 경로
 */
function normalizeIncludePath(path) {
  // 이미 절대 경로인 경우 그대로 반환
  if (path.startsWith("/")) {
    return path;
  }

  // 현재 페이지의 경로를 분석
  const currentPath = window.location.pathname;
  const currentDir = currentPath.substring(0, currentPath.lastIndexOf("/") + 1);

  // 상대 경로 처리
  let normalizedPath = currentDir + path;

  // './' 처리
  normalizedPath = normalizedPath.replace(/\/\.\//g, "/");

  // '../' 처리
  while (normalizedPath.includes("../")) {
    normalizedPath = normalizedPath.replace(/\/[^\/]+\/\.\.\//g, "/");
  }

  // 중복 슬래시 제거
  normalizedPath = normalizedPath.replace(/\/+/g, "/");

  console.log(`[Include] 경로 정규화: ${path} → ${normalizedPath}`);
  return normalizedPath;
}

/**
 * HTML 내부의 절대 경로를 상대 경로로 변환
 * @param {string} html - 변환할 HTML 문자열
 * @param {string} includePath - include된 파일의 원본 경로
 * @returns {string} - 경로가 수정된 HTML 문자열
 */
function convertAbsolutePathsToRelative(html, includePath) {
  // 현재 페이지의 깊이 계산
  const currentPath = window.location.pathname;
  let depth = (currentPath.match(/\//g) || []).length - 1;

  // 루트 페이지인 경우 depth 조정
  if (currentPath === "/" || currentPath === "/index.html") {
    depth = 0;
  }

  // 상대 경로 prefix 생성
  const relativePrefix = depth > 0 ? "../".repeat(depth) : "./";

  console.log(
    `[Include] current path: ${currentPath}, depth: ${depth}, prefix: ${relativePrefix}`
  );

  // 절대 경로를 상대 경로로 변환
  let processedHtml = html;

  // src 속성의 절대 경로 변환
  processedHtml = processedHtml.replace(
    /src="\/([^"]+)"/g,
    `src="${relativePrefix}$1"`
  );

  // href 속성의 절대 경로 변환 (CSS, 링크 등)
  processedHtml = processedHtml.replace(
    /href="\/([^"]+)"/g,
    `href="${relativePrefix}$1"`
  );

  // CSS background-image의 절대 경로 변환
  processedHtml = processedHtml.replace(
    /url\(['"]?\/([^'")]+)['"]?\)/g,
    `url('${relativePrefix}$1')`
  );

  // style 속성 내 background-image 절대 경로 변환
  processedHtml = processedHtml.replace(
    /style="([^"]*background-image:\s*url\(['"]?)\/([^'")]+)(['"]?\))([^"]*)"/g,
    `style="$1${relativePrefix}$2$3$4"`
  );

  return processedHtml;
}

window.addEventListener("load", function () {
  const isDev = !this.window.location.href.includes("urock_homepage_bucket");
  const includeElements = document.querySelectorAll("[data-include-path]");

  let totalComponents = includeElements.length;
  let loadedComponents = 0;

  if (totalComponents === 0) {
    triggerAllComponentsLoaded();
    return;
  }

  includeElements.forEach((el) => {
    const path = isDev
      ? el.dataset.includePath
      : "/urock_homepage_bucket" + el.dataset.includePath;
    if (path) {
      loadComponent(el, path);
    }
  });

  function triggerAllComponentsLoaded() {
    console.log("[Include] all components loaded");
    document.dispatchEvent(new CustomEvent("allComponentsLoaded"));
  }

  function checkAllComponentsLoaded() {
    loadedComponents++;
    console.log(
      `[Include] component load status: ${loadedComponents}/${totalComponents}`
    );
    if (loadedComponents >= totalComponents) {
      triggerAllComponentsLoaded();
    }
  }

  async function loadComponent(el, path) {
    console.log(`[Include] element load started: ${path}`);
    try {
      // 경로 정규화
      const normalizedPath = normalizeIncludePath(path);

      const response = await fetch(normalizedPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let html = await response.text();
      console.log(`[Include] file loaded: ${normalizedPath}`);

      // 절대 경로를 상대 경로로 변환
      html = convertAbsolutePathsToRelative(html, path);

      // 원본 요소의 데이터 속성 보존
      const originalDataAttrs = {};
      for (const attr of el.attributes) {
        if (
          attr.name.startsWith("data-") &&
          attr.name !== "data-include-path"
        ) {
          originalDataAttrs[attr.name] = attr.value;
        }
      }

      // HTML 교체
      el.outerHTML = html;

      // 교체된 요소에 데이터 속성 적용 (intro 섹션의 경우)
      if (path.includes("intro.html")) {
        const introSection = document.querySelector(".intro");
        const txtGroup = introSection?.querySelector(".txt-group");

        if (txtGroup) {
          // 데이터 속성을 txt-group 요소에 적용
          Object.entries(originalDataAttrs).forEach(([key, value]) => {
            txtGroup.setAttribute(key, value);
          });
          console.log(
            `[Include] intro data attributes passed:`,
            originalDataAttrs
          );
        }
      }

      const componentName = path.split("/").pop().replace(".html", "");
      const event = new CustomEvent("componentLoaded", {
        detail: {
          component: componentName,
          path: normalizedPath,
          element: document.querySelector(`.${componentName}`), // 원본과 유사하게 단순화
        },
      });
      document.dispatchEvent(event);

      checkAllComponentsLoaded();
    } catch (error) {
      console.error(`[Include] file load failed: ${path}`, error);
      el.innerHTML = `<!-- Failed to load ${path}: ${error.message} -->`;
      checkAllComponentsLoaded(); // 실패해도 카운트는 증가시켜서 무한 대기 방지
    }
  }
});
