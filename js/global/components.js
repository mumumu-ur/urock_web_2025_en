// 전역에서 쓰이는 컴포넌트 등록 혹은 유틸 컴포넌트 모음

// 전역에서 사용할 수 있는 공통 UI 컴포넌트 기능 정의

/**
 * 로딩 스피너를 생성해서 body에 추가하는 함수
 */
export function showLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.id = "global-loading-spinner";
  spinner.innerHTML = "Loading...";
  spinner.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.6);
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    z-index: 9999;
  `;
  document.body.appendChild(spinner);
}

/**
 * 로딩 스피너를 제거하는 함수
 */
export function hideLoadingSpinner() {
  const spinner = document.getElementById("global-loading-spinner");
  if (spinner) spinner.remove();
}
