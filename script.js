document.addEventListener('DOMContentLoaded', ()=>{
  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if(navToggle && nav) navToggle.addEventListener('click', ()=> nav.classList.toggle('show'));

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const t = document.querySelector(href);
        if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile nav
        if(nav && nav.classList.contains('show')) nav.classList.remove('show');
      }
    });
  });

  // Reveal on scroll and animate skill tags
  const reveals = document.querySelectorAll('.section, .glass, .project-card, .skill-tags, .hero-card');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          // animate tags inside
          entry.target.querySelectorAll('.tag').forEach((t,i)=>{
            t.style.transition = `box-shadow .6s ${i*60}ms, color .3s ${i*60}ms`;
            t.classList.add('glow');
          });
          obs.unobserve(entry.target);
        }
      });
    },{threshold:0.12});
    reveals.forEach(r=>io.observe(r));
  } else {
    reveals.forEach(r=>r.classList.add('in-view'));
  }

  // Contact form (simulated)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      // Basic validation
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.message.value.trim();
      if(!name || !email || !msg){
        status.textContent = 'Please complete all fields.';
        status.style.color = 'var(--text-muted)';
        return;
      }
      status.textContent = 'Sending...';
      status.style.color = 'var(--text-muted)';
      setTimeout(()=>{
        status.textContent = 'Thanks — your message has been sent (simulated).';
        status.style.color = 'var(--accent)';
        form.reset();
      }, 900);
    });
  }

    // Button ripple effect
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('.btn');
      if(!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      const x = e.clientX - rect.left - size/2;
      const y = e.clientY - rect.top - size/2;
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      btn.appendChild(ripple);
      setTimeout(()=>{ ripple.remove(); }, 800);
    });

    // Interactive tilt / pull-forward effect for main texts
    const interactive = document.querySelectorAll('.display-name, .section-title');
    interactive.forEach(el=>{
      el.addEventListener('mousemove', (e)=>{
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left)/rect.width - 0.5; // -0.5..0.5
        const y = (e.clientY - rect.top)/rect.height - 0.5;
        const rotateY = x * 18; // degrees
        const rotateX = -y * 12;
        const translateZ = 22;
        el.style.transition = 'transform 0.06s linear';
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(1.02)`;
      });
  
      // Nav link click pulse
      document.querySelectorAll('.nav a').forEach(a=>{
        a.addEventListener('click', ()=>{
          a.classList.add('nav-click');
          setTimeout(()=>a.classList.remove('nav-click'),260);
        });
      });

      // Compact header on scroll so logo remains visible
      const header = document.querySelector('.site-header');
      const scThreshold = 60;
      if(header){
        const onScroll = ()=>{
          if(window.scrollY > scThreshold) header.classList.add('scrolled');
          else header.classList.remove('scrolled');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, {passive:true});
      }
      el.addEventListener('mouseleave', ()=>{
        el.style.transition = 'transform .45s cubic-bezier(.2,.9,.25,1)';
        el.style.transform = '';
      });
    });

  // Toggle nav front effect when header compacts; also play a pop animation on load
  (function(){
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav a');
    if(!header || !navLinks.length) return;
    const toggleNavFront = ()=>{
      if(window.scrollY > 60) header.classList.add('nav-front'); else header.classList.remove('nav-front');
    };
    toggleNavFront();
    window.addEventListener('scroll', toggleNavFront, {passive:true});
    // initial pop animation once
    setTimeout(()=>{ header.classList.add('nav-pop'); setTimeout(()=>header.classList.remove('nav-pop'), 700); }, 700);
    // bring individual link closer to pointer on mousemove (subtle)
    document.querySelector('.nav')?.addEventListener('mousemove', (e)=>{
      navLinks.forEach(a=>{
        const r = a.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width/2);
        const dy = e.clientY - (r.top + r.height/2);
        const dist = Math.sqrt(dx*dx + dy*dy);
        const max = 120; const strength = Math.max(0, (max - dist)/max);
        a.style.transform = `translateZ(${12*strength}px) translateY(${ -4*strength }px)`;
        a.style.transition = 'transform 0.12s linear';
      });
    });
    document.querySelector('.nav')?.addEventListener('mouseleave', ()=>{
      navLinks.forEach(a=>{ a.style.transform=''; });
    });
  })();

    /* Site loader behavior */
    const siteLoader = document.getElementById('siteLoader');
    const loaderBar = document.getElementById('loaderBar');
    if(siteLoader && loaderBar){
      let progress = 2;
      const tick = setInterval(()=>{
        progress = Math.min(98, progress + Math.floor(Math.random()*8)+2);
        loaderBar.style.width = progress + '%';
      }, 300);
      window.addEventListener('load', ()=>{
        clearInterval(tick);
        loaderBar.style.width = '100%';
        setTimeout(()=>{ siteLoader.setAttribute('aria-hidden','true'); }, 450);
      });
      // fallback in case load fires late
      setTimeout(()=>{ if(!siteLoader.hasAttribute('aria-hidden')){ siteLoader.setAttribute('aria-hidden','true'); } }, 3000);
    }

    /* Chatbot: lightweight client-side assistant that replies as "Aswin" */
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const startChat = document.getElementById('startChat');

    function appendMessage(text, who='bot', meta){
      const el = document.createElement('div');
      el.className = 'msg '+(who==='user'?'user':'bot');
      el.textContent = text;
      if(meta && meta.typing) el.innerHTML = '<span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return el;
    }

    // Simple persona replies — acts like Aswin: friendly, direct, helpful
    const canned = [
      {q:['hi','hello','hey'], a:["Hey — I'm Aswin! What would you like to know?","Hello! Ask me about my projects or studies."]},
      {q:['project','projects','portfolio'], a:["I build full-stack apps and ML demos — which project do you want to hear about?","My portfolio highlights projects in AI, web, and tooling."]},
      {q:['resume','cv'], a:["You can view my resume from the top — I keep it updated with recent projects.","Resume is available via the 'View Resume' button."]},
      {q:['study','college','school','cse'], a:["I'm a CSE student at Toc H Institute — focused on AI/ML and software development."]},
      {q:['contact','email'], a:["You can email me at the address in the footer — I'll respond when available."]},
    ];

    function botReply(message){
      const txt = message.toLowerCase();
      for(const entry of canned){
        for(const k of entry.q) if(txt.includes(k)){
          const resp = entry.a[Math.floor(Math.random()*entry.a.length)];
          return resp;
        }
      }
      // fallback: short personalized response
      return "Nice question — I usually explain projects, my learning path, or tools I use. Ask me for specifics (e.g. 'AI project').";
    }

    function simulateBotResponse(userText){
      // show typing
      const typingEl = appendMessage('', 'bot', {typing:true});
      const reply = botReply(userText);
      const delay = Math.min(1600 + reply.length*12, 3500);
      setTimeout(()=>{
        typingEl.remove();
        appendMessage(reply, 'bot');
        persistConversation();
      }, delay);
    }

    function persistConversation(){
      if(!chatMessages) return;
      const messages = Array.from(chatMessages.children).map(n=>({c:n.className, t:n.textContent}));
      try{ localStorage.setItem('aswin_chat', JSON.stringify(messages)); }catch(e){}
    }

    function loadConversation(){
      try{
        const data = JSON.parse(localStorage.getItem('aswin_chat')||'null');
        if(Array.isArray(data)){
          data.forEach(m=>{
            const who = m.c && m.c.indexOf('user')>-1 ? 'user' : 'bot';
            appendMessage(m.t, who);
          });
        }
      }catch(e){}
    }

    if(chatToggle){
      chatToggle.addEventListener('click', ()=>{
        chatWindow.setAttribute('aria-hidden','false');
        chatToggle.style.display = 'none';
        // load persisted
        loadConversation();
      });
    }
    if(chatClose){
      chatClose.addEventListener('click', ()=>{
        chatWindow.setAttribute('aria-hidden','true');
        chatToggle.style.display = '';
      });
    }
    if(startChat){
      startChat.addEventListener('click', ()=>{
        // seed greeting
        appendMessage("Hey — I'm Aswin. Great to meet you! Ask me anything.", 'bot');
        persistConversation();
      });
    }
    if(chatForm){
      chatForm.addEventListener('submit', e=>{
        e.preventDefault();
        const text = chatInput.value.trim();
        if(!text) return;
        appendMessage(text, 'user');
        chatInput.value = '';
        simulateBotResponse(text);
      });
    }

    // Small welcome prompt on first visit (shows loader then chat bubble greeting)
    try{
      const seen = localStorage.getItem('aswin_seen_welcome');
      if(!seen){
        localStorage.setItem('aswin_seen_welcome','1');
        setTimeout(()=>{
          // open chat briefly with greeting
          if(chatToggle){ chatToggle.click(); }
          setTimeout(()=>{
            appendMessage("Welcome! I'm Aswin — say hi or ask about my work.", 'bot');
          }, 600);
        }, 900);
      }
    }catch(e){}

    // Social links behavior: attempt mobile app intent first, fallback to popup; show email modal for mailto
    const emailModal = document.getElementById('emailModal');
    const emailClose = document.getElementById('emailClose');
    const copyEmail = document.getElementById('copyEmail');
    const openMailClient = document.getElementById('openMailClient');
    const emailValue = document.getElementById('emailValue');
    const userEmail = emailValue ? emailValue.textContent.trim() : 'aswingr75@gmail.com';

    function isMobile(){ return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent); }

    function openPopup(url){
      const w = Math.min(900, Math.round(window.innerWidth * 0.8));
      const h = Math.min(820, Math.round(window.innerHeight * 0.8));
      const left = Math.max(0, Math.round((screen.width - w) / 2));
      const top = Math.max(0, Math.round((screen.height - h) / 2));
      const win = window.open(url, 'socialPopup', `scrollbars=yes,width=${w},height=${h},left=${left},top=${top}`);
      if(!win) window.open(url, '_blank', 'noopener'); else win.focus();
    }

    function tryIntentOpen(url){
      try{
        const u = new URL(url);
        const host = u.hostname.replace('www.','');
        if(isMobile()){
          if(host.includes('linkedin.com')){
            const parts = u.pathname.split('/').filter(Boolean);
            const username = parts[1] || parts[0] || '';
            if(username){
              const intent = `intent://in/${username}#Intent;package=com.linkedin.android;scheme=linkedin;end`;
              window.location = intent;
              setTimeout(()=>openPopup(url), 900);
              return;
            }
          }
          if(host.includes('instagram.com')){
            const parts = u.pathname.split('/').filter(Boolean);
            const username = parts[0] || '';
            if(username){
              const intent = `intent://user?username=${username}#Intent;package=com.instagram.android;scheme=instagram;end`;
              window.location = intent;
              setTimeout(()=>openPopup(url), 900);
              return;
            }
          }
        }
      }catch(e){}
      // default
      openPopup(url);
    }

    document.querySelectorAll('.social-btn[data-url]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const url = btn.getAttribute('data-url');
        if(!url) return; e.preventDefault();
        if(url.startsWith('mailto:')){
          // show modal with email rather than immediately opening mail client
          if(emailModal){ emailModal.setAttribute('aria-hidden','false'); }
          return;
        }
        // try app intent on mobile, else popup
        tryIntentOpen(url);
      });
    });

    if(emailClose){ emailClose.addEventListener('click', ()=> emailModal && emailModal.setAttribute('aria-hidden','true')); }
    if(copyEmail){ copyEmail.addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(userEmail); copyEmail.textContent = 'Copied'; setTimeout(()=>copyEmail.textContent = 'Copy Email',1200); }catch(e){ copyEmail.textContent = 'Copy'; }
    }); }
    if(openMailClient){ openMailClient.addEventListener('click', ()=>{ window.location.href = `mailto:${userEmail}`; }); }
});

// Greeting removed — no-op
