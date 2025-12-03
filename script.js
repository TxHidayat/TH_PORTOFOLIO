// Basic interactive behaviors & data
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year'); year.textContent = new Date().getFullYear();

  // Boot sequence (simulate console boot)
  const boot = document.querySelector('.boot-screen');
  const bootText = document.querySelector('.boot-text');
  const bootLines = [
    "Initializing Creative Console 2090...",
    "Loading profile assets...",
    "Mounting analog modules (vinyl, tape, radio)...",
    "Syncing presets...",
    "Ready. Welcome."
  ];
  let i=0;
  function typeLine(line, callback){
    bootText.textContent = "";
    let j=0;
    const iv = setInterval(()=>{
      bootText.textContent += line[j++] || "";
      if(j>line.length) { clearInterval(iv); setTimeout(callback, 450); }
    }, 18);
  }
  function runBoot(){
    if(i < bootLines.length){
      typeLine(bootLines[i++], runBoot);
    } else {
      boot.classList.add('fadeout');
      setTimeout(()=> boot.style.display='none', 600);
      // activate home
      showPanel('projects');
    }
  }
  runBoot();

  // Panels nav
  const knobs = Array.from(document.querySelectorAll('.knob-btn'));
  function showPanel(id){
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active-panel'));
    const el = document.getElementById(id);
    if(el) el.classList.add('active-panel');
    knobs.forEach(b=>b.classList.toggle('active', b.dataset.target===id));
  }
  knobs.forEach(btn=>{
    btn.addEventListener('click', ()=> showPanel(btn.dataset.target));
  });

  // Play button toggles vinyl
  const vinyl = document.getElementById('vinyl');
  const playBtn = document.getElementById('playBtn');
  let spinning = true;
  playBtn.addEventListener('click', () => {
    spinning = !spinning;
    if(spinning){ vinyl.classList.add('spinning'); playBtn.textContent = '▶'; playBtn.setAttribute('aria-pressed','true') }
    else { vinyl.classList.remove('spinning'); playBtn.textContent = '▌▌'; playBtn.setAttribute('aria-pressed','false') }
  });

  // Populate projects (tape cards)
  const projects = [
    {id:1, title:'Market UX Redesign', category:'UI/UX', year:2025, desc:'Redesign marketplace checkout flow with microinteractions and accessibility.'},
    {id:2, title:'BikeTrac App', category:'Mobile', year:2024, desc:'Real-time tracker with sleek UI & local notifications integration.'},
    {id:3, title:'Virtu Card', category:'Web App', year:2025, desc:'Digital business card builder with shareable profiles.'},
    {id:4, title:'Foodly Delivery', category:'Research', year:2024, desc:'End-to-end delivery UX research and prototype for Boyolali region.'}
  ];
  const grid = document.getElementById('tapeGrid');
  projects.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'tape-card';
    card.innerHTML = `
      <div class="tape-top">
        <div class="tape-reels">
          <div class="reel">◐</div>
          <div class="reel">◑</div>
        </div>
        <div>
          <div class="tape-label">${p.title}</div>
          <div class="tape-meta">${p.category} • ${p.year}</div>
        </div>
      </div>
    `;
    card.addEventListener('click', ()=> openModal(p));
    grid.appendChild(card);
  });

  // Modal detail
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.getElementById('closeModal');
  function openModal(proj){
    modalBody.innerHTML = `
      <h3>${proj.title} <small style="color:var(--muted);font-weight:600">• ${proj.year}</small></h3>
      <div style="display:flex;gap:12px;align-items:flex-start;margin-top:12px">
        <div style="width:320px;height:200px;background:linear-gradient(180deg,#0b0b0b,#111);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--muted)">Preview</div>
        <div style="flex:1">
          <p style="color:var(--muted)">${proj.desc}</p>
          <p style="margin-top:12px"><strong>Role:</strong> Lead UI/UX & Front-end</p>
          <p><strong>Stack:</strong> Figma • React • CSS • Node</p>
          <div style="margin-top:12px;display:flex;gap:8px">
            <a class="btn" href="#" onclick="event.preventDefault(); alert('Open live demo')">Open Demo</a>
            <a class="btn" href="#" onclick="event.preventDefault(); alert('Open source')">Source</a>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  }
  closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));
  modal.addEventListener('click', (e)=> { if(e.target === modal) modal.classList.add('hidden')});

  // Needle meters on About (animate widths)
  document.querySelectorAll('.needle').forEach(n=>{
    const val = +n.dataset.value || 50;
    n.style.width = `${val}%`;
  });

  // Simple knob interactions (drag rotate)
  function makeKnob(el, onChange){
    let dragging=false, startAngle=0, startVal=+el.dataset.value||0;
    const rect = ()=>el.getBoundingClientRect();
    el.addEventListener('pointerdown', (e)=>{
      dragging=true;
      el.setPointerCapture(e.pointerId);
      const r=rect(), cx=r.left + r.width/2, cy=r.top + r.height/2;
      startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180/Math.PI;
    });
    window.addEventListener('pointermove', (e)=>{
      if(!dragging) return;
      const r=rect(), cx=r.left + r.width/2, cy=r.top + r.height/2;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180/Math.PI;
      const delta = ang - startAngle;
      startAngle = ang;
      let v = +el.dataset.value || 0;
      v = Math.max(0, Math.min(10, v + Math.round(delta/12)));
      el.dataset.value = v;
      el.style.transform = `rotate(${(v*18)-90}deg)`;
      if(onChange) onChange(v);
    });
    window.addEventListener('pointerup', ()=>{ dragging=false; });
    // init render
    const v0 = +el.dataset.value || 0;
    el.style.transform = `rotate(${(v0*18)-90}deg)`;
  }
  makeKnob(document.getElementById('expKnob'), v => {
    // example - reflect experience as needle width
    document.querySelectorAll('.needle')[0].style.width = `${Math.min(100, v*10)}%`;
  });

  // Big knobs control eq bars (skills)
  document.querySelectorAll('.knob-big').forEach(k=>{
    const v = +k.dataset.value || 6;
    k.style.opacity = 0.95;
    k.addEventListener('click', ()=> {
      const newV = ( +k.dataset.value % 10 ) + 1;
      k.dataset.value = newV;
      k.style.boxShadow = `0 8px 30px rgba(0,0,0,0.6)`;
    });
  });

  // Radio dial - rotate pointer and highlight freq
  const dial = document.getElementById('dial');
  const pointer = dial.querySelector('.dial-pointer');
  const label = dial.querySelector('.dial-label');
  let dialValue = 88.01;
  function setDial(val){
    dialValue = val;
    const angle = (val - 88) * 3.5; // scale to visual
    pointer.style.transform = `rotate(${angle}deg)`;
    label.textContent = val.toFixed(2);
    // highlight matching freq if exists
    document.querySelectorAll('.freq').forEach(f => {
      f.style.background = (Math.abs(+f.dataset.freq - val) < 0.6) ? 'linear-gradient(180deg, rgba(245,106,62,0.08), transparent)' : 'var(--glass)';
    });
  }
  // make dial draggable
  makeDraggableDial(dial, setDial);

  function makeDraggableDial(el, callback){
    let dragging=false, startAngle=0, startVal=dialValue;
    const rect = ()=>el.getBoundingClientRect();
    el.addEventListener('pointerdown', (e)=>{
      dragging=true;
      el.setPointerCapture(e.pointerId);
      const r=rect(), cx=r.left + r.width/2, cy=r.top + r.height/2;
      startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180/Math.PI;
      startVal = dialValue;
    });
    window.addEventListener('pointermove', (e)=>{
      if(!dragging) return;
      const r=rect(), cx=r.left + r.width/2, cy=r.top + r.height/2;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180/Math.PI;
      const delta = ang - startAngle;
      const value = Math.min(110, Math.max(88.00, +(startVal + delta/3).toFixed(2)));
      callback(value);
    });
    window.addEventListener('pointerup', ()=>{ dragging=false; });
  }

  // Contact send button (demo)
  document.getElementById('sendMsg').addEventListener('click', ()=>{
    const txt = document.getElementById('contactMsg').value.trim();
    if(!txt) { alert('Tinggalkan pesan singkat dulu.'); return; }
    alert('Pesan terkirim: ' + txt);
    document.getElementById('contactMsg').value = '';
  });

  // Accessibility: keyboard nav between panels (1..4)
  window.addEventListener('keydown', (e)=>{
    if(e.key >= '1' && e.key <= '4'){
      const map = { '1':'projects', '2':'about', '3':'skills', '4':'contact' };
      showPanel(map[e.key]);
    }
    if(e.key === 'Escape') modal.classList.add('hidden');
  });

});
