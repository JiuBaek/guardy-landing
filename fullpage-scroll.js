(function () {

  /* ── 1. 모바일 100vh 보정 ── */
  function setVh() {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  }
  setVh();
  window.addEventListener("resize", setVh);

  /* ── 2. PC / 모바일 판단 ── */
  const isPC = window.innerWidth >= 1024;

  /* ── 3. 모바일: 자연 스크롤 ── */
  if (!isPC) {
    /* 스크롤 확실히 풀기 */
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "";
    document.body.style.overflow = "";
    document.body.style.overflowY = "";

    /* 다운로드 버튼: 첫 섹션 벗어나면 표시 */
    function initMobile() {
      const firstSection = document.querySelector(".mobile-version .img-section");
      const dlBtn = document.querySelector(".fixed-download");
      if (firstSection && dlBtn) {
        dlBtn.style.display = "none";
        new IntersectionObserver((entries) => {
          dlBtn.style.display = entries[0].isIntersecting ? "none" : "flex";
        }, { threshold: 0.5 }).observe(firstSection);
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initMobile);
    } else {
      initMobile();
    }

    return; /* 모바일은 여기서 끝 */
  }

  /* ── 4. PC 풀페이지 스크롤 ── */
  function initPC() {

    const sections = [
      ...document.querySelectorAll(".pc-version .img-section:not(.footer-section), .carousel-overlay-section"),
    ];
    if (!sections.length) return;

    const footerEl = document.querySelector(".pc-version .footer-section");

    let current  = 0;
    let locked   = false;
    let inFooter = false;
    const DURATION = 750;
    const EASE     = () => `transform ${DURATION}ms cubic-bezier(0.77, 0, 0.18, 1)`;

    /* 스크롤 막기 (PC만) */
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    /* 섹션 초기화 */
    sections.forEach((sec, i) => {
      sec.style.position   = "fixed";
      sec.style.top        = "0";
      sec.style.left       = "0";
      sec.style.width      = "100%";
      sec.style.height     = "100%";
      sec.style.zIndex     = i + 1;
      sec.style.transform  = i === 0 ? "translateY(0)" : "translateY(100%)";
      sec.style.transition = "none";
      sec.style.overflow   = "hidden";
    });

    /* footer 초기화 */
    if (footerEl) {
      footerEl.style.position   = "fixed";
      footerEl.style.top        = "0";
      footerEl.style.left       = "0";
      footerEl.style.width      = "100%";
      footerEl.style.height     = "100vh";
      footerEl.style.overflowY  = "auto";
      footerEl.style.zIndex     = sections.length + 2;
      footerEl.style.transform  = "translateY(100%)";
      footerEl.style.transition = "none";
    }

    /* ── 헤더 + 다운로드 버튼 전환 ── */
    function updateUI(idx) {
      const header = document.querySelector(".hero-header");
      const logo   = document.querySelector(".hero-header .brand-logo");
      const dlBtn  = document.querySelector(".fixed-download");
      if (header && logo) {
        header.classList.toggle("scrolled", idx !== 0);
        logo.src = idx === 0 ? "./images/logo.png" : "./images/logo_blue.png";
      }
      if (dlBtn) dlBtn.style.display = idx === 0 ? "none" : "flex";
    }

    /* ── 섹션 이동 ── */
    function goTo(next) {
      if (locked || next === current) return;
      if (next < 0 || next >= sections.length) return;
      locked = true;
      if (next > current) {
        sections[next].style.transition = EASE();
        sections[next].style.transform  = "translateY(0)";
      } else {
        sections[current].style.transition = EASE();
        sections[current].style.transform  = "translateY(100%)";
      }
      updateUI(next);
      setTimeout(() => { current = next; locked = false; }, DURATION);
    }

    /* ── footer 진입 / 탈출 ── */
    function enterFooter() {
      if (!footerEl || locked) return;
      locked = true; inFooter = true;
      footerEl.style.transition = EASE();
      footerEl.style.transform  = "translateY(0)";
      updateUI(sections.length);
      setTimeout(() => { locked = false; }, DURATION);
    }

    function exitFooter() {
      if (!footerEl || locked) return;
      locked = true; inFooter = false;
      footerEl.scrollTop = 0;
      footerEl.style.transition = EASE();
      footerEl.style.transform  = "translateY(100%)";
      updateUI(current);
      setTimeout(() => { locked = false; }, DURATION);
    }

    function next() {
      if (inFooter) return;
      if (current === sections.length - 1 && footerEl) enterFooter();
      else goTo(current + 1);
    }
    function prev() {
      if (inFooter) exitFooter();
      else goTo(current - 1);
    }

    /* ── 휠 ── */
    window.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (locked) return;
      if (inFooter) {
        if (e.deltaY > 0) footerEl.scrollTop += e.deltaY;
        else if (footerEl.scrollTop <= 0) exitFooter();
        else footerEl.scrollTop += e.deltaY;
        return;
      }
      e.deltaY > 0 ? next() : prev();
    }, { passive: false });

    /* ── 키보드 ── */
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") next();
      else if (e.key === "ArrowUp" || e.key === "PageUp") prev();
    });

    /* ── 터치 (PC 터치스크린) ── */
    let ty = 0, tx = 0;
    window.addEventListener("touchstart", (e) => {
      ty = e.touches[0].clientY; tx = e.touches[0].clientX;
    }, { passive: true });
    window.addEventListener("touchend", (e) => {
      const dy = ty - e.changedTouches[0].clientY;
      const dx = tx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 40) return;
      if (inFooter) { if (dy < 0) exitFooter(); return; }
      dy > 0 ? next() : prev();
    }, { passive: true });

    /* ── #real-stories 링크 ── */
    document.querySelector('a[href="#real-stories"]')?.addEventListener("click", (e) => {
      e.preventDefault();
      const was = inFooter;
      if (was) exitFooter();
      const idx = sections.indexOf(document.getElementById("real-stories"));
      if (idx !== -1) setTimeout(() => goTo(idx), was ? DURATION : 0);
    });

    updateUI(0);

  } // initPC

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPC);
  } else {
    initPC();
  }

})();