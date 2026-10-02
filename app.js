(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chapters = $$('.chapter[data-chapter]');
  const navLinks = $$('[data-nav]');
  let activeChapter = 0;
  let ticking = false;

  const twoDigits = value => String(value).padStart(2, '0');

  function hideCurtain() {
    $('.intro-curtain')?.classList.add('is-hidden');
  }

  if (document.readyState === 'complete') {
    window.setTimeout(hideCurtain, 180);
  } else {
    window.addEventListener('load', () => window.setTimeout(hideCurtain, 180), { once: true });
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  $$('.reveal-item').forEach(item => revealObserver.observe(item));

  function setActiveChapter(index) {
    if (index === activeChapter && navLinks[index]?.classList.contains('is-active')) return;
    activeChapter = index;
    const chapter = chapters[index];
    $('#chapterNumber').textContent = twoDigits(index + 1);
    $('#chapterTitle').textContent = chapter.dataset.chapter;
    document.body.dataset.theme = chapter.dataset.theme || 'dark';
    navLinks.forEach((link, linkIndex) => {
      const active = linkIndex === index;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function updateScrollState() {
    const scrollTop = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    $('#progressBar').style.transform = `scaleX(${Math.min(1, scrollTop / maxScroll)})`;

    const focusLine = window.innerHeight * 0.45;
    let current = 0;
    chapters.forEach((chapter, index) => {
      if (chapter.getBoundingClientRect().top <= focusLine) current = index;
    });
    setActiveChapter(current);

    $$('[data-scroll-scene]').forEach(scene => {
      const rect = scene.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      scene.style.setProperty('--scene-progress', progress.toFixed(3));
    });
    const need = $('#need');
    if (need) {
      const rect = need.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      need.style.setProperty('--page-progress', progress.toFixed(3));
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollState);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  function observeSceneSteps(selector, callback) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) callback(Number(entry.target.dataset.index), entry.target);
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    $$(selector).forEach(step => observer.observe(step));
    return observer;
  }

  observeSceneSteps('.scroll-step', (index, step) => {
    $('#systemVerb').textContent = step.dataset.title;
    $('#systemText').textContent = step.dataset.copy;
    $('#systemStep').textContent = twoDigits(index + 1);
  });

  const benefitData = [
    {
      title: 'Flexibilidad',
      text: 'Caracterización 3D, microcapas ultrafinas y técnicas de aplicación ajustables.',
      image: 'assets/images/thin-layer.webp',
      alt: 'Aplicación de una microcapa ultrafina',
      caption: 'TEXTURE PASTE · 0,1–0,2 mm'
    },
    {
      title: 'Estética',
      text: 'Efectos naturales, corrección de tono y un acabado fluorescente equilibrado.',
      image: 'assets/images/tooth-final.webp',
      alt: 'Resultado estético final de una restauración',
      caption: 'EFECTOS · CROMA · FLUORESCENCIA'
    },
    {
      title: 'Eficiencia',
      text: 'Pastas listas para usar, con una consistencia orientada a una aplicación rápida.',
      image: 'assets/images/application-paste.webp',
      alt: 'Pasta VITA LUMEX UNIQUE lista para usar',
      caption: 'LISTA PARA USAR · CONSISTENCIA ÓPTIMA'
    },
    {
      title: 'Predecible',
      text: 'El color ya es visible durante la estratificación para controlar el resultado de cocción.',
      image: 'assets/images/tooth-control.webp',
      alt: 'Control visual del color durante la estratificación',
      caption: 'CONTROL · PRECISIÓN'
    }
  ];
  let currentBenefit = 0;
  let benefitManualUntil = 0;

  function setBenefit(index) {
    if (index === currentBenefit && $('#benefitTitle').textContent === benefitData[index].title) return;
    currentBenefit = index;
    const data = benefitData[index];
    const visual = $('.benefit-visual');
    const image = $('#benefitImage');
    visual.classList.add('is-changing');
    const apply = () => {
      image.src = data.image;
      image.alt = data.alt;
      $('#benefitNumber').textContent = twoDigits(index + 1);
      $('#benefitIndex').textContent = twoDigits(index + 1);
      $('#benefitTitle').textContent = data.title;
      $('#benefitText').textContent = data.text;
      $('#benefitCaption').textContent = data.caption;
      $$('.dot-tab').forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
      });
      requestAnimationFrame(() => visual.classList.remove('is-changing'));
    };
    if (reducedMotion) apply();
    else window.setTimeout(apply, 180);
  }

  $$('.dot-tab').forEach(button => button.addEventListener('click', () => {
    benefitManualUntil = Date.now() + 900;
    setBenefit(Number(button.dataset.benefit));
  }));
  observeSceneSteps('.benefit-trigger', index => {
    if (Date.now() > benefitManualUntil) setBenefit(index);
  });

  const lightData = {
    365: { title: 'Máxima visibilidad', text: 'La fuerte excitación permite observar con claridad la intensidad y los efectos.' },
    395: { title: 'Percepción realista', text: 'Al estar más cerca de la luz visible, ofrece una percepción más natural.' },
    combined: { title: 'Visibilidad + naturalidad', text: 'De la máxima lectura del efecto a una percepción cercana a la luz visible.' }
  };

  $$('[data-light]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.light;
    $('#lightObject').dataset.mode = mode;
    $('#lightTitle').textContent = lightData[mode].title;
    $('#lightText').textContent = lightData[mode].text;
    $$('[data-light]').forEach(item => item.classList.toggle('is-active', item === button));
  }));
  $('#lightObject').dataset.mode = 'combined';

  const layerData = [
    { frame: 0, title: 'Construir el croma', text: 'CHROMA PASTE ajusta el croma dentro de los grupos de tonos correspondientes.' },
    { frame: 1, title: 'Introducir mamelones', text: 'MAMELON EFFECT organiza la arquitectura visual interna.' },
    { frame: 2, title: 'Añadir translucidez', text: 'TRANSLUCENT EFFECT reproduce profundidad incisal, halo y otros efectos naturales.' },
    { frame: 4, title: 'Texturizar la superficie', text: 'TEXTURE PASTE modifica forma y textura mediante microcapas ultrafinas.' },
    { frame: 7, title: 'Glasear y revelar', text: 'FLUO-GLAZE completa el acabado y equilibra la fluorescencia.' }
  ];
  let currentLayer = 0;
  let layerManualUntil = 0;

  function setLayer(index) {
    currentLayer = Math.max(0, Math.min(layerData.length - 1, index));
    const data = layerData[currentLayer];
    $('.sequence-window').style.setProperty('--frame-shift', `${data.frame * -12.5}%`);
    $('#layerNumber').textContent = `${twoDigits(currentLayer + 1)} / 05`;
    $('#layerTitle').textContent = data.title;
    $('#layerText').textContent = data.text;
    $('#layerProgress').style.width = `${(currentLayer + 1) * 20}%`;
    $$('.layer-trigger').forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === currentLayer));
    $('#previousLayer').disabled = currentLayer === 0;
    $('#nextLayer').disabled = currentLayer === layerData.length - 1;
  }

  $('#previousLayer').addEventListener('click', () => {
    layerManualUntil = Date.now() + 900;
    setLayer(currentLayer - 1);
  });
  $('#nextLayer').addEventListener('click', () => {
    layerManualUntil = Date.now() + 900;
    setLayer(currentLayer + 1);
  });
  observeSceneSteps('.layer-trigger', index => {
    if (Date.now() > layerManualUntil) setLayer(index);
  });
  setLayer(0);

  const workflowData = {
    basic: {
      label: 'BASIC', title: 'Una ruta clara hacia el resultado.',
      text: 'Situación inicial, distribución de materiales y resultado final en una secuencia fácil de leer.',
      images: [
        { src: 'assets/images/workflow-basic-posterior.webp', alt: 'Flujo BASIC para restauración posterior' },
        { src: 'assets/images/workflow-basic-anterior.webp', alt: 'Flujo BASIC para restauración anterior' }
      ]
    },
    posterior: {
      label: 'CREATIVE · POSTERIOR', title: 'Diseñar el efecto por zonas.',
      text: 'La distribución de efectos y cromas se organiza sobre vistas oclusales y laterales antes del resultado final.',
      images: [{ src: 'assets/images/workflow-creative-posterior.webp', alt: 'Flujo CREATIVE para restauración posterior' }]
    },
    anterior: {
      label: 'CREATIVE · ANTERIOR', title: 'Controlar profundidad y translucidez.',
      text: 'Las zonas de color y efecto construyen una lectura más natural sobre la superficie vestibular.',
      images: [{ src: 'assets/images/workflow-creative-anterior.webp', alt: 'Flujo CREATIVE para restauración anterior' }]
    }
  };
  let currentWorkflow = 'basic';
  let workflowImageIndex = 0;

  function renderWorkflow() {
    const data = workflowData[currentWorkflow];
    const imageData = data.images[workflowImageIndex];
    const wrap = $('.workflow-image-wrap');
    wrap.classList.add('is-changing');
    const apply = () => {
      $('#workflowImage').src = imageData.src;
      $('#workflowImage').alt = imageData.alt;
      $('#workflowLabel').textContent = data.label;
      $('#workflowTitle').textContent = data.title;
      $('#workflowText').textContent = data.text;
      const toggle = $('#workflowToggle');
      toggle.hidden = data.images.length < 2;
      toggle.childNodes[0].nodeValue = workflowImageIndex === 0 ? 'Ver anterior ' : 'Ver posterior ';
      requestAnimationFrame(() => wrap.classList.remove('is-changing'));
    };
    if (reducedMotion) apply(); else window.setTimeout(apply, 160);
  }

  $$('.workflow-tabs button').forEach(button => button.addEventListener('click', () => {
    currentWorkflow = button.dataset.workflow;
    workflowImageIndex = 0;
    $$('.workflow-tabs button').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    renderWorkflow();
  }));
  $('#workflowToggle').addEventListener('click', () => {
    const length = workflowData[currentWorkflow].images.length;
    workflowImageIndex = (workflowImageIndex + 1) % length;
    renderWorkflow();
  });

  const range = $('#comparisonRange');
  function updateComparison(value = Number(range.value)) {
    const safeValue = Math.max(0, Math.min(100, value));
    range.value = safeValue;
    $('#comparisonAfter').style.right = `${100 - safeValue}%`;
    $('#comparisonLine').style.left = `${safeValue}%`;
  }
  range.addEventListener('input', () => updateComparison());
  $('#comparison').addEventListener('pointerdown', event => {
    const rect = event.currentTarget.getBoundingClientRect();
    updateComparison(((event.clientX - rect.left) / rect.width) * 100);
  });
  updateComparison();

  let firedState = false;
  $('#stateCard').addEventListener('click', () => {
    firedState = !firedState;
    const card = $('#stateCard');
    card.classList.add('is-changing');
    window.setTimeout(() => {
      $('#stateImage').src = firedState ? 'assets/images/fired-state.webp' : 'assets/images/wet-state.webp';
      $('#stateImage').alt = firedState ? 'Restauración después de la cocción' : 'Restauración en estado húmedo';
      $('#stateLabel').textContent = firedState ? 'Después de la cocción' : 'En estado húmedo';
      card.classList.remove('is-changing');
    }, reducedMotion ? 0 : 160);
  });

  $$('[data-dialog]').forEach(button => button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (dialog?.showModal) dialog.showModal();
  }));
  $('#helpButton').addEventListener('click', () => $('#helpDialog').showModal());
  $$('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  }));

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      // Fullscreen can be unavailable in an embedded preview; presentation remains usable.
    }
  }
  $('#fullscreenButton').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    $('#fullscreenButton').setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Entrar en pantalla completa');
  });

  const menuButton = $('#menuButton');
  function closeMenu() {
    document.body.classList.remove('nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
  menuButton.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navLinks.forEach((link, index) => link.addEventListener('click', event => {
    event.preventDefault();
    closeMenu();
    goToChapter(index);
  }));

  function goToChapter(index) {
    const target = chapters[Math.max(0, Math.min(chapters.length - 1, index))];
    const previousBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, target.offsetTop);
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = previousBehavior;
      updateScrollState();
    });
  }

  document.addEventListener('keydown', event => {
    const tag = event.target.tagName;
    const interactive = ['INPUT', 'BUTTON', 'A', 'TEXTAREA', 'SELECT'].includes(tag) || event.target.isContentEditable;
    const openDialog = $('dialog[open]');
    if (event.key === 'Escape') {
      if (openDialog) openDialog.close();
      closeMenu();
      return;
    }
    if (openDialog || interactive || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      goToChapter(activeChapter + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goToChapter(activeChapter - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goToChapter(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goToChapter(chapters.length - 1);
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
    } else if (event.key === '?') {
      $('#helpDialog').showModal();
    }
  });

  $('#restartButton').addEventListener('click', () => goToChapter(0));
})();
