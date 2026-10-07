// Pemilih bisnis di beranda: klik atau pakai tombol panah.
// Warna aksen halaman ikut berganti lewat atribut data-biz di <html>.
(function () {
  var root = document.documentElement;
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".biz-tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".biz-panel"));
  if (!tabs.length) return;

  function select(tab, moveFocus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) {
      p.hidden = p.id !== tab.getAttribute("aria-controls");
    });
    root.dataset.biz = tab.dataset.biz;
    if (moveFocus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      select(tab, false);
      // Di layar sempit panel ada di bawah daftar, pastikan terlihat.
      if (window.matchMedia("(max-width: 900px)").matches) {
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });

  // Dari halaman studi kasus: index.html?biz=pesan-legal#bisnis
  var wanted = new URLSearchParams(window.location.search).get("biz");
  var match = tabs.filter(function (t) { return t.dataset.biz === wanted; })[0];
  if (match) select(match, false);
})();
