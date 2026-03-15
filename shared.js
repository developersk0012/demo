// ===== SK EDUCATION – SHARED JS =====

const FB = 'https://education-bd8a9-default-rtdb.firebaseio.com';

async function fbGet(p) {
  try { const r = await fetch(`${FB}/${p}.json`); return await r.json(); } catch { return null; }
}
async function fbSet(p, d) {
  try { const r = await fetch(`${FB}/${p}.json`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return await r.json(); } catch { return null; }
}
async function fbPush(p, d) {
  try { const r = await fetch(`${FB}/${p}.json`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }); return await r.json(); } catch { return null; }
}
async function fbDel(p) {
  try { await fetch(`${FB}/${p}.json`, { method:'DELETE' }); } catch {}
}

function getUser() {
  const s = localStorage.getItem('sk_user');
  return s ? JSON.parse(s) : null;
}
function setUser(u) { localStorage.setItem('sk_user', JSON.stringify(u)); }
function clearUser() { localStorage.removeItem('sk_user'); }

function showToast(msg, duration = 3000) {
  let t = document.getElementById('sk-toast');
  if (!t) {
    const wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.innerHTML = '<div class="toast" id="sk-toast"></div>';
    document.body.appendChild(wrap);
    t = document.getElementById('sk-toast');
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

function applyTheme() {
  const th = localStorage.getItem('sk_theme');
  if (th === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
}

// Load logo image if ss.png exists
function loadLogo(el) {
  if (!el) return;
  const img = new Image();
  img.onload = () => {
    el.innerHTML = `<img src="ss.png" alt="SK">`;
  };
  img.onerror = () => { /* keep fallback SK text */ };
  img.src = 'ss.png';
}

// Generate PDF ID Card
function generateIDCard(user) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: [85, 54] }); // Credit card size

  // Background gradient simulation
  doc.setFillColor(26, 115, 232);
  doc.rect(0, 0, 85, 54, 'F');
  doc.setFillColor(13, 71, 161);
  doc.rect(0, 38, 85, 16, 'F');

  // White overlay
  doc.setFillColor(255,255,255);
  doc.roundedRect(4, 8, 77, 28, 2, 2, 'F');

  // Logo area
  doc.setFillColor(26, 115, 232);
  doc.circle(10, 10, 5, 'F');
  doc.setFontSize(5); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold');
  doc.text('SK', 10, 11.5, { align: 'center' });

  // Institute name
  doc.setFontSize(6); doc.setTextColor(26,115,232); doc.setFont('helvetica','bold');
  doc.text('SK EDUCATION', 42, 11, { align: 'center' });
  doc.setFontSize(4.5); doc.setFont('helvetica','normal'); doc.setTextColor(107,114,128);
  doc.text('Swami Vivekanand Study Point', 42, 15, { align: 'center' });

  // Student info
  doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(30,30,45);
  doc.text(user.name || 'Student', 8, 22);
  doc.setFontSize(5.5); doc.setFont('helvetica','normal'); doc.setTextColor(107,114,128);
  doc.text(`Class: ${user.class || '10'}th`, 8, 26.5);
  doc.text(`Mob: ${user.phone || ''}`, 8, 30.5);
  doc.text(`${user.email || ''}`, 8, 34.5);

  // Footer
  doc.setFontSize(5); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold');
  doc.text('skeducation.in', 42, 42, { align: 'center' });
  doc.setFont('helvetica','normal');
  doc.text(`Joined: ${new Date(user.joinDate||Date.now()).toLocaleDateString('en-IN')}`, 42, 46, { align: 'center' });
  doc.text('Valid: Academic Year 2026-27', 42, 50, { align: 'center' });

  doc.save(`SK_ID_${(user.name||'student').replace(/\s/g,'_')}.pdf`);
}
