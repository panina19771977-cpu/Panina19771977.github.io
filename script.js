/* =========================================================
   Natalia Help Project — Script (final clean version)
   Author: Natalia Domkina
   Smooth transitions, calculator, queue, alerts, counters
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // плавное появление
  document.body.classList.add("page-loaded");

  // плавный уход при переходе по .html ссылкам (внутри сайта)
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener("click", (e) => {
      if (link.target === "_blank") return;
      e.preventDefault();
      const href = link.getAttribute("href");
      document.body.classList.remove("page-loaded");
      document.body.style.opacity = "0";
      setTimeout(() => window.location.href = href, 500);
    });
  });

  // анимация чисел в hero (участники/фонд), если элементы есть
  animateCount("participants", 0, 26, 1400, "ru-RU");
  animateCount("fund", 0, 2600, 1600, "ru-RU");

  // форма: короткое подтверждение
  const applyForm = document.querySelector("form.apply-form");
  if (applyForm) {
    applyForm.addEventListener("submit", () => {
      setTimeout(() => alert("Спасибо! Заявка отправлена 💚"), 80);
    });
  }
});

/* -------- калькулятор выплат -------- */
function calculatePayout() {
  const input = document.getElementById("contribution");
  const result = document.getElementById("result");
  if (!input || !result) return;

  const val = Number(input.value);
  if (!val || val < 10) {
    result.innerHTML = "Введите сумму не меньше 10 €.";
    return;
  }

  const months = Math.ceil(10000 / val);
  result.innerHTML = `Примерно столько месяцев до выплаты: <strong>${months}</strong>. Это пример, не гарантия.`;
}

/* -------- очередь / прогноз -------- */
function showQueue() {
  const pos = Number(document.getElementById("queuePos").value);
  const total = Number(document.getElementById("queueTotal").value);
  const contrib = Number(document.getElementById("queueContrib").value);
  const tbody = document.getElementById("queueTableBody");
  if (!pos || !total || !contrib || !tbody) return;

  const fund = total * contrib; // общий фонд в мес
  const pplPerMonth = Math.max(1, Math.floor(fund / 10000)); // сколько людей можно выплатить в мес
  const start = Math.max(1, pos - 3);
  const end = Math.min(total, pos + 3);

  let rows = "";
  for (let i = start; i <= end; i++) {
    const m = Math.ceil(i / pplPerMonth);
    rows += `<tr${i === pos ? ' class="highlight-row"' : ''}>
      <td>${i}</td>
      <td>${m}</td>
      <td>${(i % 10 === 0) ? '🎁' : ''}</td>
    </tr>`;
  }
  rows += `<tr><td colspan="3" class="muted small">
    Всего фонд: ${fund.toLocaleString("ru-RU")} € · Выплачиваем в месяц: ${pplPerMonth} чел.
  </td></tr>`;

  tbody.innerHTML = rows;
}

/* -------- утилита: анимация чисел -------- */
function animateCount(id, start, end, duration, locale = "en-US") {
  const el = document.getElementById(id);
  if (!el) return;
  let startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    const val = Math.floor(start + (end - start) * p);
    el.textContent = val.toLocaleString(locale);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* -------- плавное появление блока "Проект только начинается" -------- */
const newStart = document.querySelector('.new-start');
if (newStart) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });
  observer.observe(newStart);
}

/* -------- Отслеживание действий пользователей -------- */
function trackEvent(eventCategory, eventAction, eventLabel) {
  if (typeof gtag === "function") {
    gtag("event", eventAction, {
      event_category: eventCategory,
      event_label: eventLabel
    });
  }
}

/* -------- Клики по кнопкам -------- */
// PayPal
document.querySelectorAll('[href*="paypal"]').forEach(btn => {
  btn.addEventListener("click", () => {
    trackEvent("donation", "click", "PayPal button");
  });
});

// Revolut
document.querySelectorAll('[href*="revolut"]').forEach(btn => {
  btn.addEventListener("click", () => {
    trackEvent("donation", "click", "Revolut button");
  });
});

// Поделиться
document.querySelectorAll('[href*="share"], .share-btn').forEach(btn => {
  btn.addEventListener("click", () => {
    trackEvent("engagement", "click", "Share button");
  });
});

// Отправка формы Formspree
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", () => {
    trackEvent("form", "submit", "Application Form");
  });
}