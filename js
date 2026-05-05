// ---- SISTEMA DE CARGA Y AJUSTE DE IMÁGENES ----
// Cada imagen se ajusta automáticamente al contenedor sin deformarse (object-fit contain)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Configurar todos los inputs de tipo file y botones reset
  const fileInputs = document.querySelectorAll('.img-upload-input');
  const resetButtons = document.querySelectorAll('.reset-img');

  // Función para leer y aplicar imagen a un elemento <img> específico
  function handleImageUpload(inputElement, targetImgIdOrElement) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      let targetImg = null;
      // si target es un string (ID) o directamente un elemento
      if (typeof targetImgIdOrElement === 'string') {
        targetImg = document.getElementById(targetImgIdOrElement);
      } else {
        targetImg = targetImgIdOrElement;
      }
      if (targetImg && targetImg.tagName === 'IMG') {
        targetImg.src = e.target.result;
        // garantizar que la imagen se ajuste al contenedor sin romper layout
        targetImg.style.objectFit = 'contain';
        targetImg.style.maxWidth = '100%';
        targetImg.style.maxHeight = '100%';
      }
    };
    reader.readAsDataURL(file);
  }

  // Para cada input, determinar a qué imagen afecta según data-target o relación DOM
  fileInputs.forEach(input => {
    input.addEventListener('change', (event) => {
      const targetKey = input.getAttribute('data-target');
      let imgElement = null;

      if (targetKey === 'heroImg') {
        imgElement = document.getElementById('heroImg');
      } 
      else if (targetKey === 'product') {
        // buscar la imagen dentro del mismo bloque .card-img-area (el más cercano)
        const cardArea = input.closest('.card-img-area');
        if (cardArea) {
          imgElement = cardArea.querySelector('.product-img');
        }
      }
      else if (targetKey === 'extraImg1') {
        imgElement = document.getElementById('extraImg1');
      }
      else if (targetKey === 'extraImg2') {
        imgElement = document.getElementById('extraImg2');
      }
      else {
        // fallback: si data-target apunta a un ID real
        imgElement = document.getElementById(targetKey);
      }

      if (imgElement) {
        handleImageUpload(input, imgElement);
      } else {
        // Si no se encuentra, intentar buscar dentro del .img-upload-placeholder cercano
        const parentPlaceholder = input.closest('.img-upload-placeholder');
        if (parentPlaceholder) {
          const nestedImg = parentPlaceholder.querySelector('img');
          if (nestedImg) handleImageUpload(input, nestedImg);
        } else if (input.closest('.hero-image-area')) {
          const heroImg = document.getElementById('heroImg');
          if (heroImg) handleImageUpload(input, heroImg);
        } else if (input.closest('.card-img-area')) {
          const productImg = input.closest('.card-img-area').querySelector('img');
          if (productImg) handleImageUpload(input, productImg);
        }
      }
      // resetear value para permitir subir la misma imagen otra vez
      input.value = '';
    });
  });

  // Función reset para restaurar imagen por defecto según contexto
  resetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetKey = btn.getAttribute('data-target');
      let imgToReset = null;

      if (targetKey === 'heroImg') {
        imgToReset = document.getElementById('heroImg');
        if (imgToReset) imgToReset.src = 'https://placehold.co/400x240/2c3e66/white?text=Hero+Phone';
      } 
      else if (targetKey === 'product') {
        const parentArea = btn.closest('.card-img-area');
        if (parentArea) {
          imgToReset = parentArea.querySelector('.product-img');
          if (imgToReset) {
            const cardTitleElem = parentArea.closest('.card')?.querySelector('.card-title')?.innerText || 'Phone';
            let defaultSrc = 'https://placehold.co/300x200/1e2a3e/white?text=Premium';
            if (cardTitleElem.includes('Phantom')) defaultSrc = 'https://placehold.co/300x200/1e2a3e/white?text=Phantom+X';
            else if (cardTitleElem.includes('Aura')) defaultSrc = 'https://placehold.co/300x200/2c3e66/white?text=Ultra+Edge';
            else if (cardTitleElem.includes('Titanium')) defaultSrc = 'https://placehold.co/300x200/4a3f2e/white?text=Elite';
            imgToReset.src = defaultSrc;
          }
        }
      }
      else if (targetKey === 'extraImg1') {
        imgToReset = document.getElementById('extraImg1');
        if (imgToReset) imgToReset.src = 'https://placehold.co/300x160/2c3e66/white?text=Batería+AI';
      }
      else if (targetKey === 'extraImg2') {
        imgToReset = document.getElementById('extraImg2');
        if (imgToReset) imgToReset.src = 'https://placehold.co/300x160/2c3e66/white?text=Cámara+Triple';
      }
      else {
        // Reseteo genérico al placeholder
        const possibleImg = btn.closest('.img-upload-placeholder')?.querySelector('img') || 
                            btn.closest('.hero-image-area')?.querySelector('img') ||
                            btn.closest('.card-img-area')?.querySelector('img');
        if (possibleImg) {
          possibleImg.src = 'https://placehold.co/400x200/cccccc/333333?text=Imagen+Actualizable';
        }
      }

      if (imgToReset) {
        imgToReset.style.objectFit = 'contain';
      }
    });
  });

  // Ajuste extra: Para todas las imágenes existentes, garantizar que usen object-fit contain
  const allImages = document.querySelectorAll('img');
  allImages.forEach(img => {
    img.style.objectFit = 'contain';
    img.style.maxWidth = '100%';
    // Si alguna imagen no tiene width inline, se mantiene responsiva
    if (!img.style.height) img.style.height = 'auto';
  });

  // pequeña mejora: al hacer clic en texto editable, mantener estilos
  const editableDivs = document.querySelectorAll('[contenteditable="true"]');
  editableDivs.forEach(el => {
    el.setAttribute('spellcheck', 'false');
  });
});
