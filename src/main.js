import { renderApp } from './ui/components.js';
import { start3DAnimation } from './domain/animation.js';
import { initGoogleDriveTestButton } from './ui/gdriveTest.js';

document.addEventListener('DOMContentLoaded', () => {
    renderApp('app');
    start3DAnimation();
    initGoogleDriveTestButton();
});
