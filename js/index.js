/**
 * 메인 자바스크립트
 * 모든 JS 파일을 import하는 엔트리 포인트
 */

import "../css/style.css";

/* ========== 00. HTML Include 시스템 ========== */
import "./include.js"; /* HTML 컴포넌트 동적 삽입 */

/* ========== 01. 글로벌 설정 ========== */
import "./global/events.js"; /* 이벤트 관련 */
import "./global/components.js"; /* 공통 컴포넌트 */
import "./global/config.js"; /* 설정 */
import "./global/constants.js"; /* 상수 */
import "./global/utils.js"; /* 유틸리티 함수 */
import "./global/componentManager.js"; /* 컴포넌트 관리자 */
import "./global/email.js"; /* 이메일 관련 */
import "./global/supportTabConfig.js"; /* 지원 탭 설정 */

/* ========== 02. UI 컴포넌트 ========== */
import "./component/buttons.js"; /* 버튼 컴포넌트 */
import "./component/title.js"; /* 제목 컴포넌트 */
import "./component/tab-config.js"; /* 탭 설정 */
import "./component/tab.js"; /* 탭 컴포넌트 */
import "./component/inputs.js"; /* 입력 필드 컴포넌트 */

import "./component/fab.js"; /* 플로팅 액션 버튼 */
import "./component/cards.js"; /* 카드 컴포넌트 */
import "./component/banner.js"; /* 배너 컴포넌트 */
import "./component/breadcrumb.js"; /* 브레드크럼 네비게이션 */
import "./component/swiper.js"; /* 스와이퍼 컴포넌트 */
import "./component/certificate-swiper.js"; /* Certificate 스와이퍼 컴포넌트 */

/* ========== 03. 섹션별 스크립트 ========== */
/* 레이아웃 컴포넌트 */
import "./section/header.js"; /* 헤더 레이아웃 */
import "./section/footer.js"; /* 푸터 레이아웃 */

/* 섹션 컴포넌트 */
import "./section/hero.js"; /* 히어로 섹션 */
import "./section/intro.js"; /* 인트로 섹션 */
import "./section/contents.js"; /* 콘텐츠 섹션 */
import "./section/description.js"; /* 설명 섹션 */
import "./section/feature.js"; /* 특징 섹션 */
import "./section/process.js"; /* process 섹션 */
import "./section/utilization.js"; /* 활용 섹션 */
import "./section/effect.js"; /* 효과 섹션 */
import "./section/client.js"; /* 클라이언트 섹션 */
import "./section/news.js"; /* 뉴스 섹션 */
import "./section/certificate.js"; /* 인증서 섹션 */

/* ========== 04. 페이지별 스크립트 ========== */
import "./page/main.js";
import "./page/company.js";
import "./page/solution.js";
import "./page/service.js";
import "./page/support.js";
/* 솔루션 및 지원 페이지 통합 스크립트 */
/* 서비스 페이지들은 ./page/service.js에서 통합 관리됨 */
/* 지원 페이지들은 ./page/solution.js에서 통합 관리됨 */

/* 개별 관리 */
