// Calculator and queue utils
const TOTAL_PAYOUT = 10000;

function fmtMonths(m){
  const years = Math.floor(m/12);
  const months = Math.round(m % 12);
  return `${years} лет и ${months} мес (${Math.round(m)} мес)`;
}

function calcPayoutMonths(contribution){
  return TOTAL_PAYOUT / contribution;
}

function handleCalc(formId, outId){
  const form = document.getElementById(formId);
  const out = document.getElementById(outId);
  const c = parseFloat(form.contribution.value);
  if (!c || c<=0){ out.textContent = "Введите взнос больше 0 €"; return; }
  const m = calcPayoutMonths(c);
  out.textContent = `Чтобы собрать 10 000 €, потребуется примерно ${fmtMonths(m)}.`;
}

function buildQueue(tableId, position, participants, monthlyContribution){
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  const monthlyFund = participants * monthlyContribution;
  const winnersPerMonth = Math.max(1, Math.floor(monthlyFund / TOTAL_PAYOUT));
  const start = Math.max(1, position-5);
  const end = Math.min(participants, position+4);
  for(let i=start;i<=end;i++){
    const monthsUntil = Math.ceil(i / winnersPerMonth);
    const lucky = (Math.random() < 0.05) ? "Да" : "—";
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${i}</td><td>${monthsUntil}</td><td>${lucky}</td>`;
    if (i===position){ tr.style.background = "#ecfdf5";}
    tbody.appendChild(tr);
  }
}

function handleQueue(formId, tableId){
  const f = document.getElementById(formId);
  const pos = parseInt(f.position.value);
  const ppl = parseInt(f.participants.value);
  const cont = parseFloat(f.monthly.value);
  if(!pos || !ppl || !cont || pos>ppl){
    alert("Проверьте номер, взнос и число участников.");
    return;
  }
  buildQueue(tableId, pos, ppl, cont);
}

// Simple navbar highlight
(function(){
  const links = document.querySelectorAll('nav .links a');
  links.forEach(a=>{
    if (a.getAttribute('href') === location.pathname.split('/').pop()) {
      a.style.background = '#fff1';
    }
  });
})();
