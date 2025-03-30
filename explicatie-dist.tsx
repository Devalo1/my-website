/**
 * EXPLICAȚIE DESPRE FOLDERUL DIST ȘI SITE-UL LIVE
 * 
 * Workflow-ul funcționează astfel:
 * 
 * 1. Local:
 *    - Codul sursă este în directorul 'src'
 *    - Resursele statice sunt în directorul 'public'
 *    - Când rulezi 'npm run dev' => site live local la http://localhost:5173/my-website/
 * 
 * 2. Build:
 *    - Când rulezi 'npm run build' => creează directorul 'dist'
 *    - Folderul 'dist' conține toate fișierele optimizate și pregătite pentru producție
 *    - Conține HTML, CSS, JavaScript minificat, imagini optimizate, etc.
 * 
 * 3. Deployment:
 *    - GitHub Actions ia conținutul din 'dist' și îl publică pe GitHub Pages
 *    - Site-ul live de la https://devalo1.github.io/my-website/ este exact 
 *      ce se află în folderul 'dist'
 * 
 * Deci 'dist' este versiunea pregătită pentru producție a site-ului tău,
 * care este apoi publicată online la URL-ul GitHub Pages.
 */
