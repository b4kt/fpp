document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("search");
  const toggleButton = document.getElementById("toggleButton");
  const shortcutButton = document.getElementById("shortcutButton");
  const searchEngineSelect = document.getElementById("searchEngineSelect");
  const goButton = document.querySelector('button[data-for="search"]');
  const countdownEl = document.getElementById("restart-countdown");

  function isPhone() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = screenWidth / screenHeight;
    return screenWidth < 768 && aspectRatio < 1;
  }

  if (isPhone()) {
    document.body.innerHTML = `
      <h1 class="banner">Mobile support being fixed</h1>
    `;
    document.body.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
      background-color: #000;
      color: #fff;
      font-family: 'typewriter', monospace;
      padding: 1rem;
    `;
    return;
  }

  if (searchBar) {
    function adjustSearchWidth() {
      setTimeout(() => {
        searchBar.scrollTo(0, 0);
      }, 10);

      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.whiteSpace = "pre";
      span.style.font = window.getComputedStyle(searchBar).font;
      span.textContent = searchBar.value || searchBar.placeholder || "";

      document.body.appendChild(span);

      const minWidth =
        parseInt(window.getComputedStyle(searchBar).minWidth, 10) || 150;
      const newWidth = Math.max(span.offsetWidth + 40, minWidth);
      searchBar.style.width = `${newWidth}px`;

      document.body.removeChild(span);
    }

    searchBar.addEventListener("input", adjustSearchWidth);
    searchBar.addEventListener("focus", adjustSearchWidth);
    adjustSearchWidth();

    searchBar.addEventListener("keypress", (ev) => {
      if (ev.key === "Enter") {
        console.log("Enter keypress event listener triggered.");
        ev.preventDefault();
        sendQuery();
        if (typeof chemicalAction === "function") {
          console.log("Calling chemicalAction from keypress listener.");
          chemicalAction("submit", "search");
        } else if (goButton) {
          console.warn(
            "ca not found on Enter press, clicking go button as fallback.",
          );
          goButton.click();
        } else {
          console.error(
            "Cannot submit: ca not found and no Go button fallback.",
          );
        }
      }
    });

    if (goButton) {
      goButton.addEventListener("click", sendQuery);
    }

    if (searchEngineSelect) {
      const savedEngine = localStorage.getItem("searchEnginePreference");
      if (
        savedEngine &&
        [...searchEngineSelect.options].some((opt) => opt.value === savedEngine)
      ) {
        searchEngineSelect.value = savedEngine;
        searchBar.setAttribute("data-search-engine", savedEngine);
      } else {
        const currentEngine = searchBar.getAttribute("data-search-engine");
        if (currentEngine) {
          searchEngineSelect.value = currentEngine;
        }
      }
      searchEngineSelect.addEventListener("change", function () {
        searchBar.setAttribute("data-search-engine", this.value);
        localStorage.setItem("searchEnginePreference", this.value);
      });
    }
  } else {
    console.error("Search bar element (#search) not found.");
  }

  if (toggleButton && searchBar) {
    function updateNewTabButtonState() {
      if (!toggleButton) return;
      const isActive =
        searchBar.hasAttribute("data-target") &&
        searchBar.getAttribute("data-target") === "_blank";
      toggleButton.classList.toggle("button-active", isActive);
      toggleButton.setAttribute("aria-pressed", isActive ? "true" : "false");
    }

    toggleButton.addEventListener("click", function () {
      if (
        searchBar.hasAttribute("data-target") &&
        searchBar.getAttribute("data-target") === "_blank"
      ) {
        searchBar.removeAttribute("data-target");
      } else {
        searchBar.setAttribute("data-target", "_blank");
      }
      updateNewTabButtonState();
    });
    updateNewTabButtonState();
  }

  if (shortcutButton && searchBar && goButton) {
    shortcutButton.addEventListener("click", function () {
      const shortcutUrl = "https://0xdc.icu/shortcuts";
      searchBar.value = shortcutUrl;
      adjustSearchWidth();
      console.log("Shortcut button clicked. Clicking Go button (old method).");
      goButton.click();
    });
  }


  if (countdownEl) {
    const textEl = countdownEl.querySelector("p.adblock-text") || countdownEl;
    let targetRestartTime = 0;
    let intervalId = null;

    function updateCountdown() {
      if (targetRestartTime === 0) {
        if (
          !textEl.innerText.startsWith("Error") &&
          !textEl.innerText.startsWith("Restarting")
        ) {
          textEl.innerText = "Loading countdown...";
        }
        return;
      }

      const now = Date.now();
      const diff = targetRestartTime - now;

      if (diff <= 0) {
        textEl.innerText = "Restarting soon...";
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      const displayHours = String(hours).padStart(2, "0");
      const displayMinutes = String(minutes).padStart(2, "0");
      const displaySeconds = String(seconds).padStart(2, "0");

      textEl.innerText = `Restart in ${displayHours}h ${displayMinutes}m ${displaySeconds}s`;
    }

    function fetchConfigAndStartTimer() {
      fetch("/server-config")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error ${response.status}: ${response.statusText}`,
            );
          }
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            throw new Error("Received non-JSON response from server config");
          }
        })
        .then((config) => {
          const startTime = config.serverStartTime || config.sT;
          const interval = config.restartInterval || config.rI;

          if (
            typeof startTime !== "number" ||
            typeof interval !== "number" ||
            interval <= 0
          ) {
            throw new Error("Invalid config data types or interval value.");
          }

          targetRestartTime = startTime + interval;

          if (intervalId) clearInterval(intervalId);
          updateCountdown();
          intervalId = setInterval(updateCountdown, 1000);
        })
        .catch((error) => {
          console.error("Error fetching/processing server config:", error);
          textEl.innerText = "Error loading countdown.";
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        });
    }

    fetchConfigAndStartTimer();
    textEl.innerText = "Loading countdown...";
  } else {
    console.warn("#restart-countdown not found.");
  }
});
