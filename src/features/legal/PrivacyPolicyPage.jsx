import React from 'react';
import './LegalPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Política de Privacidad</h1>
        <p className="last-updated">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

        <section>
          <h2>1. Información que Recopilamos</h2>
          <p>
            POS Sistema es una aplicación que funciona completamente en tu navegador. 
            Toda la información se almacena localmente en tu dispositivo mediante localStorage 
            y no se envía a ningún servidor externo.
          </p>
        </section>

        <section>
          <h2>2. Almacenamiento de Datos</h2>
          <p>
            Todos los datos de tu negocio (productos, ventas, gastos, movimientos) se almacenan 
            únicamente en tu navegador local. No tenemos acceso a esta información.
          </p>
        </section>

        <section>
          <h2>3. Backup en Google Drive</h2>
          <p>
            Si decides usar la funcionalidad de backup en Google Drive, los datos se guardarán 
            en tu propia cuenta de Google Drive. Solo tú tienes acceso a estos backups. 
            La aplicación solo solicita permisos para crear y gestionar archivos en la carpeta 
            "POS Backups" de tu Google Drive.
          </p>
        </section>

        <section>
          <h2>4. Cookies y Tecnologías Similares</h2>
          <p>
            Esta aplicación utiliza localStorage del navegador para almacenar datos localmente. 
            No utilizamos cookies de terceros ni tecnologías de rastreo.
          </p>
        </section>

        <section>
          <h2>5. Seguridad</h2>
          <p>
            Todos los datos permanecen en tu dispositivo. No recopilamos, almacenamos ni 
            transmitimos información personal a servidores externos.
          </p>
        </section>

        <section>
          <h2>6. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta política de privacidad ocasionalmente. 
            La fecha de la última actualización se mostrará en la parte superior de esta página.
          </p>
        </section>

        <section>
          <h2>7. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política de privacidad, puedes contactarnos 
            a través del repositorio del proyecto en GitHub.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

