/* fullpage-scroll.js — minimalist version */

/* 1) 모바일 브라우저 100vh 보정 */
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}
setVh();
window.addEventListener("resize", setVh);

/* 2) 끝. 스크롤은 브라우저 + CSS 스냅이 처리.
      (휠/터치 하이재킹, spacer 삽입, 수동 인덱스 스크롤, 폼 핸들러 전부 제거) */
