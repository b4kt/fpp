document.addEventListener("DOMContentLoaded", () => {
    const e = {
        google: ["Google", "https://google.com/favicon.ico"],
        canvas: [
          "Dashboard",
          "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
        ],
        desmos: [
          "Desmos",
          "https://www.desmos.com/assets/img/apps/graphing/favicon.ico",
        ],
        drive: [
          "Google Drive",
          "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
        ],
        classroom: [
          "Google Classroom",
          "https://ssl.gstatic.com/classroom/ic_product_classroom_144.png",
        ],
        newtab: [
          "New Tab",
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABRklEQVR42mKgOqjq75ds7510YNL0uV9nAGqniqwKYiCIHIIjcAK22BGQLRdgBWvc3fnWk/FJhrkPO1xPgGvqPfLfJMHhT1yqurvS48bPaJhjD2efgidnVwa2yv59xecvEvi0UWCXq9t0ItfP2MMZ7nwIpkA8F1n8uLxZHM6yrBH7FIl2gFXDHYsErkn2hyKLHtcKrFntk58uVQJ+kSdQnmjhID4cwLLa8+K0BXsfNWCqBOsFdo2Yldv43DBrkxd30cjnNyYBhK0SQGkI9pG4Mu40D5b374DRCAyhHqXVfTmOwivivMkJxBz5wnHCtBfGgNFC+ChWKWRf3hsQIlyEoIv4IYEo5wkgtBLRekY9DE4Uin4Keae6hydGnljPmE8kRcCine6827AMsJ1IuW9ibnlQpXLBCR/WC875m2BP+VSu3c/0m+8V08OBngc0pxcAAAAASUVORK5CYII=",
        ],
        docs: [
          "Google Docs",
          "https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico",
        ],
        edpuzzle: [
          "Edpuzzle",
          "https://edpuzzle.imgix.net/favicons/favicon-32.png",
        ],
        khan: [
          "Khan Academy",
          "https://cdn.kastatic.org/images/favicon.ico?logo",
        ],
      },
      t = "tabDisguiseEnabled_Preset",
      o = "tabDisguisePreset",
      n = document.getElementById("favicon"),
      s = document.querySelector(".disguise-control-group"),
      a = document.getElementById("disguiseActivateButton"),
      i = document.getElementById("disguiseDropdownArrow"),
      l = document.getElementById("presetSelector"),
      d = document.getElementById("customDropdownList");
    if (!n || !s || !a || !i || !l || !d)
      return void console.error("Disguise elements missing!");
    let c = document.title,
      r = n.href || null,
      u = !1;
    function g(e, t) {
      (document.title = e), n && (n.href = t || "data:,");
    }
    function m() {
      if ("true" !== localStorage.getItem(t)) {
        if (u) return g(c, r), void (u = !1);
        return;
      }
      const n = localStorage.getItem(o),
        s = e[n];
      "hidden" === document.visibilityState
        ? s && (g(s[0], s[1]), (u = !0))
        : "visible" === document.visibilityState && u && (g(c, r), (u = !1));
    }
    function p() {
      const e = "true" === localStorage.getItem(t);
      localStorage.setItem(t, !e), f(!e);
    }
    function f(e) {
      a &&
        (e
          ? a.classList.add("button-active")
          : a.classList.remove("button-active"));
    }
    function v(e) {
      e.stopPropagation(), s && s.classList.toggle("show-dropdown");
    }
    function h(t) {
      const n = t.target.dataset.value;
      n &&
        ((l.value = n),
        localStorage.setItem(o, n),
        s && s.classList.remove("show-dropdown"),
        "hidden" === document.visibilityState &&
          u &&
          "true" === localStorage.getItem(t) &&
          e[n] &&
          g(e[n][0], e[n][1]));
    }
    function b() {
      if (!d) return;
      d.innerHTML = "",
        Object.keys(e).forEach((t) => {
          const o = document.createElement("div");
          o.classList.add("dropdown-item"),
            (o.textContent = e[t][0]),
            (o.dataset.value = t),
            o.addEventListener("click", h),
            d.appendChild(o);
        });
    }
    function y(e) {
      s && !s.contains(e.target) && s.classList.remove("show-dropdown");
    }
    b();
    const E = "true" === localStorage.getItem(t);
    f(E);
    const L = localStorage.getItem(o);
    L && e[L]
      ? (l.value = L)
      : Object.keys(e).length > 0 &&
        ((l.value = Object.keys(e)[0]), localStorage.setItem(o, l.value)),
      a.addEventListener("click", p),
      i.addEventListener("click", v),
      document.addEventListener("visibilitychange", m),
      document.addEventListener("click", y);
  });
