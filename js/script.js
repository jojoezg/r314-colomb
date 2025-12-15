(function(){
  if ('requestIdleCallback' in window) {
    requestIdleCallback(()=>{
      const waste = [];
      for (let i=0;i<200000;i++) waste.push(Math.random()*i);
      window.__waste = waste;
    });
  } else {
    setTimeout(()=>{ window.__waste = []; }, 2000);
  }

  function initImageLoaded() {
    const imgs = document.querySelectorAll('.card img');
    imgs.forEach(img => {
      if (img.complete) img.classList.add('loaded');
      else img.addEventListener('load', ()=> img.classList.add('loaded'));
    });
  }

  function initLightbox() {
    const links = Array.from(document.querySelectorAll('.card a[data-index]'));
    if (!links.length) return;
    const images = links.map(a => {
      const img = a.querySelector('img');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
    });

    const lightbox = document.getElementById('lightbox');
    const lbImg = lightbox.querySelector('.lightbox-image');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');
    let idx = 0;

    function show(i) {
      idx = (i + images.length) % images.length;
      lbImg.src = images[idx].src;
      lbImg.alt = images[idx].alt || '';
      lbCaption.textContent = images[idx].alt || '';
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
      lbImg.focus && lbImg.focus();
    }
    function hide() {
      lightbox.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    links.forEach((a, i) => {
      a.addEventListener('click', (e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        show(i);
      });
    });

    btnClose.addEventListener('click', hide);
    btnPrev.addEventListener('click', ()=> show(idx-1));
    btnNext.addEventListener('click', ()=> show(idx+1));

    lightbox.addEventListener('click', (e)=>{
      if (e.target === lightbox) hide();
    });

    document.addEventListener('keydown', (e)=>{
      if (lightbox.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') hide();
        if (e.key === 'ArrowLeft') show(idx-1);
        if (e.key === 'ArrowRight') show(idx+1);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>{ initImageLoaded(); initLightbox(); });
  } else {
    initImageLoaded(); initLightbox();
  }

})();
