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
          <h2>3. Uso de Google Drive y Datos de Google</h2>
          <h3>3.1. Datos de Google que Recopilamos</h3>
          <p>
            Si decides usar la funcionalidad de backup en Google Drive, la aplicación accede a los siguientes datos de tu cuenta de Google:
          </p>
          <ul>
            <li><strong>Información básica del perfil:</strong> Nombre, dirección de correo electrónico e imagen de perfil (solo para mostrar tu información cuando estás conectado)</li>
            <li><strong>Permisos de Google Drive:</strong> Acceso limitado para crear y gestionar archivos únicamente en la carpeta "POS Backups" de tu Google Drive</li>
          </ul>
          
          <h3>3.2. Cómo Usamos los Datos de Google</h3>
          <p>
            Los datos de Google se utilizan exclusivamente para:
          </p>
          <ul>
            <li>Autenticarte en Google Drive para acceder a tu cuenta</li>
            <li>Mostrar tu nombre e información de perfil cuando estás conectado a Google Drive</li>
            <li>Crear, listar y descargar archivos de backup en la carpeta "POS Backups" de tu Google Drive</li>
            <li>Proporcionar la funcionalidad de backup y restauración de datos de tu negocio</li>
          </ul>
          <p>
            <strong>NO utilizamos los datos de Google para:</strong> publicidad dirigida, venta a corredores de datos, determinación de crédito, préstamos, creación de bases de datos, entrenamiento de modelos de IA, o cualquier otro propósito que no sea proporcionar o mejorar la funcionalidad de la aplicación.
          </p>

          <h3>3.3. Compartir y Transferir Datos de Google</h3>
          <p>
            <strong>NO compartimos, transferimos ni divulgamos tus datos de Google a terceros.</strong> Los datos de Google se utilizan únicamente dentro de la aplicación para proporcionar la funcionalidad de backup en Google Drive. No vendemos, alquilamos ni compartimos tus datos de Google con ninguna otra empresa, organización o individuo.
          </p>

          <h3>3.4. Protección de Datos de Google</h3>
          <p>
            Implementamos las siguientes medidas de seguridad para proteger tus datos de Google:
          </p>
          <ul>
            <li>Utilizamos OAuth 2.0 de Google para autenticación segura</li>
            <li>Los tokens de acceso se almacenan de forma segura en tu navegador</li>
            <li>La aplicación solo solicita el scope mínimo necesario: <code>https://www.googleapis.com/auth/drive.file</code> (acceso solo a archivos creados por la aplicación)</li>
            <li>No almacenamos contraseñas ni credenciales de Google en nuestros servidores (la aplicación funciona completamente en el cliente)</li>
            <li>Todas las comunicaciones con Google se realizan mediante conexiones HTTPS seguras</li>
          </ul>

          <h3>3.5. Retención y Eliminación de Datos de Google</h3>
          <p>
            Los datos de Google se utilizan solo mientras estás conectado a Google Drive. Puedes desconectarte en cualquier momento desde el menú de Backup, lo que revocará el acceso de la aplicación a tu cuenta de Google.
          </p>
          <p>
            Los archivos de backup almacenados en tu Google Drive permanecen en tu cuenta hasta que tú los elimines manualmente. La aplicación no elimina automáticamente estos archivos.
          </p>
          <p>
            Si deseas eliminar todos los datos asociados con la aplicación:
          </p>
          <ul>
            <li>Puedes desconectar la aplicación desde el menú de Backup</li>
            <li>Puedes eliminar manualmente la carpeta "POS Backups" de tu Google Drive</li>
            <li>Puedes revocar los permisos de la aplicación en: <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">https://myaccount.google.com/permissions</a></li>
          </ul>
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

