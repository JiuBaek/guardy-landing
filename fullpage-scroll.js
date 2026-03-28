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

function toggleStorePopup() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  if (isIOS) {
    // 아이폰이면 바로 앱스토어로
    window.open("https://apps.apple.com/app/guardy", "_blank");
  } else if (isAndroid) {
    // 안드로이드면 바로 플레이스토어로
    window.open("https://play.google.com/store/apps/details?id=com.guardy.template", "_blank");
  } else {
    // PC면 팝업 띄우기
    document.getElementById("storePopup").classList.toggle("show");
  }
}