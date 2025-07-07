// /**
//  * 페이지별 탭 구성 설정
//  */

// // 솔루션 페이지 탭 구성 (기본 구성)
// const solutionTabConfig = {
//   mainTabs: [
//     { id: 'dfas', text: 'DFAS', isActive: true },
//     { id: 'mcq', text: 'MCQ', isActive: false },
//     { id: 'gm', text: 'GateManager', isActive: false }
//   ],
//   subTabs: {
//     'dfas': [
//       { id: 'dfas-pro', text: 'DFAS Pro', isActive: true },
//       { id: 'dfas-enterprise', text: 'DFAS Enterprise', isActive: false }
//     ],
//     'mcq': [
//       { id: 'mcq-p', text: 'M-SecuManager P', isActive: true },
//       { id: 'mcq-s', text: 'M-SecuManager S', isActive: false },
//       { id: 'mcq-g', text: 'M-SecuManager G', isActive: false }
//     ],
//     'gm': [
//       { id: 'gm-basic', text: 'GateManager', isActive: true },
//       { id: 'gm-pro', text: 'GateManager Pro', isActive: false }
//     ]
//   }
// };

// // 서비스 페이지 탭 구성
// const serviceTabConfig = {
//   mainTabs: [
//     { id: 'analysis', text: '포렌식 분석 서비스', isActive: true },
//     { id: 'authentication', text: '국제 표준화 인증', isActive: false },
//     { id: 'education', text: '포렌식 교육', isActive: false }
//   ],
//   subTabs: {} // 서브탭 없음
// };

// // 고객지원 페이지 탭 구성
// const supportTabConfig = {
//   mainTabs: [
//     { id: 'inquiry', text: '1:1 문의', isActive: true },
//     { id: 'news', text: '뉴스', isActive: false }
//   ],
//   subTabs: {} // 서브탭 없음
// };

// // 모든 탭 구성 설정 내보내기
// if (typeof module !== 'undefined' && module.exports) {
//   // Node.js 환경
//   module.exports = {
//     solutionTabConfig,
//     serviceTabConfig,
//     supportTabConfig
//   };
// } else {
//   // 브라우저 환경 - 전역 변수로 노출
//   window.solutionTabConfig = solutionTabConfig;
//   window.serviceTabConfig = serviceTabConfig;
//   window.supportTabConfig = supportTabConfig;
// }
