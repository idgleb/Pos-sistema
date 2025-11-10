export function renderApp(containerId) {
    const app = document.getElementById(containerId);
    app.innerHTML = `
        <canvas id="bg3d"></canvas>
        <div id="glow"></div>
        <div class="container">
            <div class="profile-info">
                <img src="https://github.com/idgleb.png" alt="Foto de perfil de idgleb" class="profile-img" loading="lazy">
                <h1>Gleb Ursol</h1>
            </div>
            <div class="main-content">
                <p>¡Hola! Soy Gleb y aquí puedes ver mis proyectos destacados...</p>
                <div class="projects">
                    <a href="https://idgleb.github.io/Pos-sistema/" class="project-btn" target="_blank">POS Sistema</a>
                    <a href="https://github.com/idgleb/ControlParental" class="project-btn" target="_blank">Control Parental</a>
                    <a href="https://github.com/idgleb/jetinno" class="project-btn" target="_blank">Jetinno Store</a>
                    <a href="https://github.com/idgleb/blackjack" class="project-btn" target="_blank">Black Jack</a>
                    <a href="https://github.com/idgleb/finanzas-app" class="project-btn" target="_blank">Finanzas-App</a>
                    <a href="https://github.com/idgleb/Easy-Gastos" class="project-btn" target="_blank">Easy-Gastos</a>
                </div>
            </div>
            <div class="test-drive-section">
                <h2 class="test-drive-title">Prueba rápida de Google Drive</h2>
                <p class="test-drive-description">
                    Usa este botón para ejecutar el flujo de autenticación de Google Drive directamente desde el landing.
                </p>
                <button id="gdrive-test-btn" class="test-drive-btn">Conectar Google Drive (prueba)</button>
                <div id="gdrive-test-status" class="test-drive-status">Aún no has iniciado sesión.</div>
            </div>
        </div>
        <footer class="site-footer">
            <div class="footer-links">
                <a href="https://idgleb.github.io/Pos-sistema/" target="_blank">POS Sistema</a>
                <span class="footer-separator">•</span>
                <a href="https://idgleb.github.io/privacy.html" target="_blank">Política de Privacidad</a>
                <span class="footer-separator">•</span>
                <a href="https://idgleb.github.io/terms.html" target="_blank">Términos de Servicio</a>
            </div>
        </footer>
    `;
}
