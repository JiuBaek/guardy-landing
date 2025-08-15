// fullpage-scroll.js
const sections = document.querySelectorAll(".section, .hero, .waitlist");
let currentIndex = 0;
let isScrolling = false;

const form = document.querySelector(".wl-form");
const popup = document.getElementById("thankyou-popup");

const headerHeight = document.querySelector("header")?.offsetHeight || 0;
document.documentElement.style.setProperty("--header-height", headerHeight + "px");

sections.forEach(sec => {
  const spacer = document.createElement("div");
  spacer.style.height = headerHeight + "px";
  spacer.style.backgroundColor = window.getComputedStyle(document.querySelector("header")).backgroundColor;
  sec.prepend(spacer);
});

// 터치 변수
let startY = 0;

// 초기 활성화
sections[0].classList.add("active");

function setVh() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVh();

// 화면 회전 / 크기 변경 시 다시 계산
window.addEventListener('resize', setVh);


function showSection(index) {
  isScrolling = true;
  document.querySelector(".sections-wrapper").style.transform =
    `translateY(-${index * 100}vh)`;
  setTimeout(() => isScrolling = false, 700);
}

function scrollToSection(index) {
  isScrolling = true;

  // 현재 index에 맞는 section으로 이동
  const headerHeight = document.querySelector("header")?.offsetHeight || 0;
  window.scrollTo({
    top: sections[index].offsetTop,
    behavior: "smooth"
  });

  // active 클래스 업데이트
  sections.forEach(sec => sec.classList.remove("active"));
  sections[index].classList.add("active");

  setTimeout(() => {
    isScrolling = false;
  }, 500); // 스크롤 애니메이션 시간과 맞추기
}

// PC 휠 이벤트
window.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (isScrolling) return;

  if (e.deltaY > 0 && currentIndex < sections.length - 1) {
    currentIndex++;
  } else if (e.deltaY < 0 && currentIndex > 0) {
    currentIndex--;
  }
  scrollToSection(currentIndex);
}, { passive: false });

// 모바일 터치 시작
window.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});

// 모바일 터치 끝
window.addEventListener("touchend", (e) => {
  const diff = startY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex < sections.length - 1) currentIndex++;
    else if (diff < 0 && currentIndex > 0) currentIndex--;
    showSection(currentIndex);
  }
});


form.addEventListener("submit", function(e) {
  e.preventDefault();
  fetch(form.action, {
    method: "POST",
    body: new FormData(form)
  })
  .then(res => res.text())
  .then(text => {
    console.log("Server says:", text); // 여기로 결과 확인
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 3000);
    form.reset();
  })
  .catch(err => console.error(err));
});
