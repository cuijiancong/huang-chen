/* ============================================
   婚宴邀请函 H5 — 交互逻辑
   所有可编辑内容均从 js/config.js 中的 WEDDING_CONFIG 读取
   ============================================ */

(function () {
  'use strict';

  const C = window.WEDDING_CONFIG;
  if (!C) { console.error('配置文件未加载，请检查 js/config.js'); return; }

  // ========== 页面内容填充 ==========
  function populatePage() {
    const n = C.couple;
    const groomName = n.groomNick || n.groom;
    const brideName = n.brideNick || n.bride;
    const titleStr = `${groomName} & ${brideName} — ${C.pageTitle}`;

    // --- document title ---
    document.title = titleStr;

    // --- 微信 / 社交网络分享卡片 OG 标签 ---
    setMeta('og:title', titleStr);
    setMeta('og:description', C.pages.cover.subtitle + '，' + C.pages.story.paragraphs[0]);
    setMeta('og:url', C.share.pageUrl || window.location.href);

    // 分享封面图：拼接完整 URL
    const shareImg = C.share && C.share.image ? C.share.image : '';
    const shareImgUrl = shareImg ? resolveUrl(shareImg) : '';
    setMeta('og:image', shareImgUrl);

    // 如果没有配置图片，尝试用照片墙第一张
    if (!shareImgUrl && C.assets.galleryPhotos.length > 0) {
      setMeta('og:image', resolveUrl(C.assets.galleryPhotos[0]));
    }

    // --- 封面 ---
    setText('[data-key="cover.subtitle"]', C.pages.cover.subtitle);
    setText('[data-key="cover.groom"]', groomName);
    setText('[data-key="cover.bride"]', brideName);
    setText('[data-key="cover.date"]', C.weddingDate.display);
    setText('[data-key="cover.slogan"]', C.pages.cover.slogan);
    setText('[data-key="cover.scrollHint"]', C.pages.cover.scrollHint);

    // --- 爱情故事 ---
    setText('[data-key="story.title"]', C.pages.story.title);
    const storyTextArea = document.getElementById('storyTextArea');
    if (storyTextArea) {
      storyTextArea.innerHTML = C.pages.story.paragraphs
        .map(p => `<p class="story-text">${p}</p>`).join('');
    }

    const storyTrack = document.getElementById('storyPhotoTrack');
    if (storyTrack) {
      storyTrack.innerHTML = C.assets.storyPhotos.map((src, i) => `
        <div class="story-photo-item">
          <img src="${src}" alt="照片 ${i + 1}">
          <span class="photo-placeholder">照片 ${i + 1}</span>
        </div>
      `).join('');
    }

    // --- 新郎页 ---
    setText('[data-key="groom.title"]', C.pages.groom.title);
    setText('[data-key="groom.name"]', C.pages.groom.name);
    setText('[data-key="groom.subtitle"]', C.pages.groom.subtitle);
    setText('[data-key="groom.desc"]', C.pages.groom.description);
    const groomPhoto = document.getElementById('groomPhoto');
    if (groomPhoto && C.assets.groomPhoto) {
      groomPhoto.src = C.assets.groomPhoto;
    }

    // --- 新娘页 ---
    setText('[data-key="bride.title"]', C.pages.bride.title);
    setText('[data-key="bride.name"]', C.pages.bride.name);
    setText('[data-key="bride.subtitle"]', C.pages.bride.subtitle);
    setText('[data-key="bride.desc"]', C.pages.bride.description);
    const bridePhoto = document.getElementById('bridePhoto');
    if (bridePhoto && C.assets.bridePhoto) {
      bridePhoto.src = C.assets.bridePhoto;
    }

    // --- 照片墙 ---
    setText('[data-key="gallery.title"]', C.pages.gallery.title);
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
      galleryGrid.innerHTML = C.assets.galleryPhotos.map((src, i) => `
        <div class="gallery-item" data-index="${i}">
          <img src="${src}" alt="婚纱照 ${i + 1}">
        </div>
      `).join('');
    }

    // --- 婚礼信息 ---
    setText('[data-key="info.title"]', C.pages.info.title);
    // 日期：大数字 + 年月/周几
    const dateNum = document.querySelector('.info-date-num');
    if (dateNum) dateNum.textContent = String(C.weddingDate.day).padStart(2, '0');
    setText('[data-key="info.dateYM"]', `${C.weddingDate.year}.${C.weddingDate.month + 1}`);
    setText('[data-key="info.dateWeekday"]', C.weddingDate.weekday);
    // 农历
    setText('[data-key="info.dateLunar"]', C.weddingDate.lunar);
    // 时间：迎宾 + 仪式在一行
    const timeStr = `${C.schedule.welcome} · ${C.weddingDate.hour}:${String(C.weddingDate.minute).padStart(2, '0')} 仪式`;
    setText('[data-key="info.timeFull"]', timeStr);
    // 地点
    setText('[data-key="info.locationName"]', C.venue.name);
    setText('[data-key="info.locationAddr"]', C.venue.address);
    setText('[data-key="info.mapHint"]', C.pages.info.mapHint);

    // 地图预览 — 直接用 fallback（不需要经纬度）
    const mapImg = document.getElementById('mapPreviewImg');
    if (mapImg) {
      // 直接触发 fallback 展示
      mapImg.style.display = 'none';
      const fallback = mapImg.nextElementSibling;
      if (fallback) fallback.style.display = 'flex';
    }

    // 倒计时标签（婚前/婚后动态切换，初始设为婚前文案）
    const cdl = document.getElementById('countdownLabel');
    if (cdl) cdl.textContent = C.countdown.before;

    // --- 感谢页 ---
    setText('[data-key="thanks.title"]', C.pages.thanks.title);
    setText('[data-key="thanks.text"]', C.pages.thanks.text);
    setText('[data-key="thanks.names"]',
      `${C.couple.groomNick || C.couple.groom} & ${C.couple.brideNick || C.couple.bride}`);
    setText('[data-key="thanks.date"]', C.weddingDate.displayShort);
    setText('[data-key="thanks.qrcodeHint"]', C.pages.thanks.qrcodeHint || '心意打赏，扫码即可');
    setText('[data-key="thanks.shareButton"]', C.pages.thanks.shareButton || '分享给朋友');

    // 收款码
    const qrGroom = document.getElementById('qrcodeGroom');
    const qrBride = document.getElementById('qrcodeBride');
    if (qrGroom && C.assets.qrcode.groom) qrGroom.src = C.assets.qrcode.groom;
    if (qrBride && C.assets.qrcode.bride) qrBride.src = C.assets.qrcode.bride;

    // --- 音乐 ---
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic && C.assets.music) {
      bgMusic.src = C.assets.music;
    }
  }

  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setMeta(property, content) {
    const el = document.querySelector(`meta[property="${property}"]`);
    if (el) el.setAttribute('content', content);
  }

  function resolveUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = window.location.origin + window.location.pathname.replace(/[^/]+$/, '');
    return base + path;
  }

  populatePage();

  // ============ DOM 引用 ============
  const pages = document.querySelectorAll('.page');
  const totalPages = pages.length;
  const indicatorDots = document.querySelectorAll('#pageIndicator .dot');
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const storyTrack = document.getElementById('storyPhotoTrack');
  const storyDotsContainer = document.getElementById('storyDots');

  // ============ 状态 ============
  let currentPage = 0;
  let isTransitioning = false;
  let touchStartY = 0;
  let touchDeltaY = 0;
  let storyCurrent = 0;
  let storyTotal = 0;
  let lightboxIndex = 0;

  // ============ 页面翻页 ============
  function goToPage(index) {
    if (isTransitioning || index === currentPage || index < 0 || index >= totalPages) return;
    isTransitioning = true;

    const direction = index > currentPage ? 'up' : 'down';
    const oldPage = pages[currentPage];
    const newPage = pages[index];

    oldPage.classList.remove('active');
    oldPage.classList.add(direction === 'up' ? 'exit-up' : 'exit-down');
    newPage.classList.add('active');

    indicatorDots.forEach((d, i) => d.classList.toggle('active', i === index));
    spawnPetals(newPage);

    currentPage = index;

    setTimeout(() => {
      oldPage.classList.remove('exit-up', 'exit-down');
      isTransitioning = false;
    }, 500);
  }

  function nextPage() { goToPage(currentPage + 1); }
  function prevPage() { goToPage(currentPage - 1); }

  // ---------- 触摸事件 ----------
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    touchDeltaY = e.touches[0].clientY - touchStartY;
  }, { passive: true });

  document.addEventListener('touchend', () => {
    const threshold = 50;
    if (Math.abs(touchDeltaY) < threshold) return;
    if (touchDeltaY < -threshold) nextPage();
    else if (touchDeltaY > threshold) prevPage();
    touchDeltaY = 0;
  });

  // ---------- 滚轮 ----------
  document.addEventListener('wheel', (e) => {
    if (isTransitioning) return;
    if (e.deltaY > 30) nextPage();
    else if (e.deltaY < -30) prevPage();
  }, { passive: true });

  // ---------- 键盘 ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); nextPage(); }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prevPage(); }
    if (e.key === 'Escape') { closeLightbox(); }
  });

  // ---------- 指示器点击 ----------
  indicatorDots.forEach(dot => {
    dot.addEventListener('click', () => goToPage(parseInt(dot.dataset.page)));
  });

  // ============ 倒计时（婚前/婚后自动切换） ============
  const wd = C.weddingDate;
  const weddingDate = new Date(wd.year, wd.month, wd.day, wd.hour, wd.minute, 0);

  function updateCountdown() {
    const now = new Date();
    let diff = weddingDate - now;
    const label = document.getElementById('countdownLabel');
    const timer = document.getElementById('countdown');
    const unitDays = timer ? timer.querySelector('.countdown-item:nth-child(1) .countdown-unit') : null;

    if (diff <= 0) {
      // 婚礼已过 — 显示"我们已经结婚"，倒计时继续显示已过天数/时/分/秒
      if (label) label.textContent = C.countdown.after;
      if (timer) timer.style.display = '';
      if (unitDays) unitDays.textContent = '天';
      diff = Math.abs(diff); // 取绝对值，显示已过去的时间
    } else {
      // 婚礼前 — 显示"距离婚礼还有"
      if (label) label.textContent = C.countdown.before;
      if (timer) timer.style.display = '';
      if (unitDays) unitDays.textContent = '天';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * 1000 * 60;
    const secs = Math.floor(diff / 1000);

    const el = document.getElementById('cd-days'); if (el) el.textContent = String(days).padStart(2, '0');
    const eh = document.getElementById('cd-hours'); if (eh) eh.textContent = String(hours).padStart(2, '0');
    const em = document.getElementById('cd-mins'); if (em) em.textContent = String(mins).padStart(2, '0');
    const es = document.getElementById('cd-secs'); if (es) es.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ============ 背景音乐 ============
  let musicStarted = false;

  // 立即尝试自动播放
  function attemptAutoPlay() {
    if (!C.assets.music || musicStarted) return;
    bgMusic.play().then(() => {
      musicStarted = true;
      musicBtn.classList.remove('paused');
      musicBtn.classList.add('playing');
    }).catch(() => {
      // 浏览器阻止了自动播放，等用户首次手势再试
    });
  }
  attemptAutoPlay();

  // 用户首次交互时再试一次（兜底 iOS 等限制自动播放的浏览器）
  function tryAutoPlayOnGesture() {
    if (!C.assets.music || musicStarted) return;
    bgMusic.play().then(() => {
      musicStarted = true;
      musicBtn.classList.remove('paused');
      musicBtn.classList.add('playing');
    }).catch(() => {});
    document.removeEventListener('touchstart', tryAutoPlayOnGesture);
    document.removeEventListener('click', tryAutoPlayOnGesture);
  }
  document.addEventListener('touchstart', tryAutoPlayOnGesture, { once: true });
  document.addEventListener('click', tryAutoPlayOnGesture, { once: true });

  window.toggleMusic = function () {
    if (!C.assets.music) return;
    if (!musicStarted) {
      bgMusic.play().then(() => {
        musicStarted = true;
        musicBtn.classList.remove('paused');
        musicBtn.classList.add('playing');
      }).catch(() => {
        musicBtn.classList.remove('paused');
        musicBtn.classList.add('playing');
        musicStarted = true;
      });
    } else {
      if (bgMusic.paused) {
        bgMusic.play();
        musicBtn.classList.remove('paused');
        musicBtn.classList.add('playing');
      } else {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('paused');
      }
    }
  };

  // ============ 地图导航（直接用地址搜索） ============
  window.openMap = function () {
    const { name, address } = C.venue;
    const query = encodeURIComponent(name + ' ' + address);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    let url;
    if (isIOS) {
      // Apple Maps — 直接用地址搜索
      url = `http://maps.apple.com/?q=${query}`;
    } else if (isAndroid) {
      // 高德地图 — 用地址搜索
      url = `https://uri.amap.com/search?keyword=${query}&callnative=1`;
    } else {
      // PC — 高德 Web 版搜索
      url = `https://uri.amap.com/search?keyword=${query}`;
    }
    window.open(url, '_blank');
  };

  // ============ 故事页照片滑动 ============
  function initStorySlider() {
    if (!storyTrack) return;
    const items = storyTrack.querySelectorAll('.story-photo-item');
    storyTotal = items.length;
    if (storyTotal === 0) return;

    storyDotsContainer.innerHTML = '';
    for (let i = 0; i < storyTotal; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToStory(i));
      storyDotsContainer.appendChild(dot);
    }

    let storyStartX = 0, storyDeltaX = 0;

    storyTrack.parentElement.addEventListener('touchstart', (e) => {
      storyStartX = e.touches[0].clientX;
      e.stopPropagation();
    });
    storyTrack.parentElement.addEventListener('touchmove', (e) => {
      storyDeltaX = e.touches[0].clientX - storyStartX;
    });
    storyTrack.parentElement.addEventListener('touchend', (e) => {
      if (Math.abs(storyDeltaX) > 40) {
        if (storyDeltaX < -40 && storyCurrent < storyTotal - 1) goToStory(storyCurrent + 1);
        else if (storyDeltaX > 40 && storyCurrent > 0) goToStory(storyCurrent - 1);
      }
      storyDeltaX = 0;
      e.stopPropagation();
    });
  }

  function goToStory(index) {
    storyCurrent = index;
    storyTrack.style.transform = `translateX(-${index * 100}%)`;
    const dots = storyDotsContainer.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  initStorySlider();

  // ============ 照片墙：背景轮播 + 灯箱 ============
  const lightboxImages = C.assets.galleryPhotos;
  let galleryActive = 0;

  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    // 初始状态：第一个高亮，第一个做背景
    setGalleryActive(0);

    galleryItems.forEach((item, index) => {
      // 单击直接打开灯箱（无延迟）
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(index);
      });
    });

    // 自动轮播背景（每 3 秒换一张）
    setInterval(() => {
      const galleryPage = document.getElementById('page5');
      if (!galleryPage || !galleryPage.classList.contains('active')) return;
      setGalleryActive((galleryActive + 1) % lightboxImages.length);
    }, 3000);
  }

  function setGalleryActive(index) {
    galleryActive = index;

    // 更新背景图
    const bg = document.getElementById('galleryBg');
    if (bg) {
      bg.style.backgroundImage = `url(${lightboxImages[index]})`;
      bg.classList.add('active');
    }

    // 更新网格中当前项高亮
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = lightboxImages[index];
    lightbox.classList.add('open');
    updateLightboxCounter();
    document.body.style.overflow = 'hidden';
  }

  window.closeLightbox = function () {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.lightboxNav = function (dir) {
    lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[lightboxIndex];
    updateLightboxCounter();
  };

  function updateLightboxCounter() {
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  }

  let lbStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { lbStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - lbStartX;
    if (Math.abs(dx) > 50) lightboxNav(dx > 0 ? -1 : 1);
    lbStartX = 0;
  });

  initLightbox();

  // ============ 分享邀请函 ============
  window.shareInvite = function () {
    const url = C.share.pageUrl || window.location.href;
    const title = document.title;
    const text = C.pages.cover.subtitle + '，' + C.pages.story.paragraphs[0];

    // 优先用 Web Share API（手机浏览器原生分享面板）
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      navigator.share({ title, text, url }).catch(() => {
        copyAndToast(url);
      });
    } else {
      // 桌面端/不支持时复制链接
      copyAndToast(url);
    }
  };

  function copyAndToast(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showToast);
    } else {
      // 降级方案
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast();
    }
  }

  function showToast() {
    const toast = document.getElementById('shareToast');
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // ============ 飘落花瓣 ============
  function spawnPetals(pageElement) {
    const container = pageElement.querySelector('.petals-container');
    if (!container) return;
    container.innerHTML = '';

    const emojis = ['🌸', '💮', '🌺', '✿'];
    for (let i = 0; i < 12; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 90 + 5 + '%';
      petal.style.animationDuration = (Math.random() * 6 + 5) + 's';
      petal.style.animationDelay = Math.random() * 5 + 's';
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      petal.setAttribute('data-emoji', emoji);
      petal.textContent = emoji;
      container.appendChild(petal);
    }
  }

  spawnPetals(pages[0]);

  // ============ 启动 ============
  pages[0].classList.add('active');
  indicatorDots[0].classList.add('active');

  console.log('💐 婚宴邀请函已就绪 — 7页');
  console.log('  - 封面 → 故事 → 新郎 → 新娘 → 照片墙 → 婚礼信息 → 感谢页');
  console.log('  - 所有内容均来自 js/config.js');
})();
