/**
 * SCRIPT CLEANUP AUTOMAT - V1.0
 * 
 * Acest script curăță automat probleme comune cu header-ul și conținutul vizibil:
 * 1. Elimină header-uri duplicate
 * 2. Elimină fragmente de cod afișate ca text
 * 3. Optimizează DOM-ul pentru performance
 */

(function() {
  console.log('Script de curățare inițiat - verificare probleme header');
  
  // Funcție pentru eliminarea header-urilor duplicate
  function removeDuplicateHeaders() {
    const headers = document.querySelectorAll('header');
    if (headers.length <= 1) return; // Nu avem duplicat
    
    console.log(`ATENȚIE: Au fost detectate ${headers.length} elemente header! Se elimină duplicatele.`);
    
    // Păstrează primul header, elimină restul
    for (let i = 1; i < headers.length; i++) {
      if (headers[i] && headers[i].parentNode) {
        console.log(`Eliminare header duplicat #${i+1}`);
        headers[i].parentNode.removeChild(headers[i]);
      }
    }
  }
  
  // Funcție pentru curățarea fragmentelor de cod afișate ca text
  function cleanupCodeFragments() {
    // Fragmente problematice cunoscute
    const problematicFragments = [
      "ad> n ong-container", 
      "ent.querySelector", 
      "fo').style.display", 
      "overlay.id", 
      "document.body.appendChild",
      "Header L.js",
      "createMobileMenu",
      "setInterval",
      ".auth-options').style.display",
      "var button = document.createElement",
      "function() {",
      "createTreeWalker"
    ];
    
    // Caută noduri text care conțin fragmente problematice
    const walker = document.createTreeWalker(
      document.body, 
      NodeFilter.SHOW_TEXT, 
      null, 
      false
    );
    
    const nodesToRemove = [];
    let node;
    while (node = walker.nextNode()) {
      // Ignoră nodurile din script și style
      if (node.parentNode.tagName === 'SCRIPT' || 
          node.parentNode.tagName === 'STYLE') {
        continue;
      }
      
      // Verifică dacă textul conține fragmente problematice
      if (problematicFragments.some(fragment => node.textContent.includes(fragment))) {
        nodesToRemove.push(node);
      }
    }
    
    // Elimină nodurile problematice
    nodesToRemove.forEach(node => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
    
    console.log(`Cleanup: ${nodesToRemove.length} fragmente de cod au fost eliminate din conținutul vizibil.`);
  }
  
  // Funcție pentru eliminarea scripturilor și stilurilor duplicat
  function removeRedundantElements() {
    // Identifică elemente duplicate după ID
    const elementsWithId = document.querySelectorAll('[id]');
    const idCounts = {};
    
    // Numără elementele cu același ID
    elementsWithId.forEach(el => {
      const id = el.id;
      idCounts[id] = (idCounts[id] || 0) + 1;
    });
    
    // Elimină duplicatele (păstrează primul element)
    for (const id in idCounts) {
      if (idCounts[id] > 1) {
        console.log(`ID duplicat detectat: "${id}" (${idCounts[id]} instanțe). Se elimină duplicatele.`);
        
        const elements = document.querySelectorAll(`#${id}`);
        for (let i = 1; i < elements.length; i++) {
          if (elements[i] && elements[i].parentNode) {
            elements[i].parentNode.removeChild(elements[i]);
          }
        }
      }
    }
    
    // Identifică și elimină stilurile redundante
    const styles = document.querySelectorAll('style');
    const styleContents = new Set();
    const stylesToRemove = [];
    
    styles.forEach(style => {
      const content = style.textContent.trim();
      if (styleContents.has(content)) {
        stylesToRemove.push(style);
      } else {
        styleContents.add(content);
      }
    });
    
    stylesToRemove.forEach(style => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    });
    
    console.log(`Cleanup: ${stylesToRemove.length} stiluri redundante eliminate.`);
  }
  
  // Funcție pentru curățarea elementelor ascunse și goale
  function removeHiddenAndEmptyElements() {
    // Identifică și elimină elemente goale și ascunse care pot cauza probleme
    const emptyDivs = document.querySelectorAll('div:empty');
    let emptyDivsRemoved = 0;
    
    emptyDivs.forEach(div => {
      // Verifică dacă div-ul nu are ID, clasă sau stil important
      if (!div.id && !div.className && !div.getAttribute('style')) {
        if (div.parentNode) {
          div.parentNode.removeChild(div);
          emptyDivsRemoved++;
        }
      }
    });
    
    console.log(`Cleanup: ${emptyDivsRemoved} elemente goale eliminate.`);
  }
  
  // Execută curățarea după încărcarea DOM-ului
  function performCleanup() {
    removeDuplicateHeaders();
    cleanupCodeFragments();
    removeRedundantElements();
    removeHiddenAndEmptyElements();
    console.log('Cleanup complet finalizat.');
  }
  
  // Execută curățarea imediată dacă documentul e gata
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', performCleanup);
    // Verifică din nou după încărcarea completă a paginii
    window.addEventListener('load', performCleanup);
  } else {
    // Documentul e deja încărcat
    performCleanup();
    // Verifică din nou după încărcarea completă a paginii
    window.addEventListener('load', performCleanup);
  }
  
  // Execută curățarea periodică pentru a prinde probleme ulterioare
  setInterval(performCleanup, 2000);
})();
