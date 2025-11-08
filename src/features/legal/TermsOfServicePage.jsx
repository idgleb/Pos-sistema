import React from 'react';
import './LegalPage.css';

const TermsOfServicePage = () => {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <h1>Términos de Servicio</h1>
        <p className="last-updated">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>

        <section>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al usar POS Sistema, aceptas estos términos de servicio. 
            Si no estás de acuerdo con estos términos, no uses la aplicación.
          </p>
        </section>

        <section>
          <h2>2. Uso de la Aplicación</h2>
          <p>
            POS Sistema es una aplicación web gratuita que funciona completamente en tu navegador. 
            Puedes usarla para gestionar productos, ventas, gastos y movimientos de tu negocio.
          </p>
        </section>

        <section>
          <h2>3. Responsabilidad por los Datos</h2>
          <p>
            Tú eres responsable de mantener backups de tus datos. Aunque la aplicación ofrece 
            funcionalidad de backup, es tu responsabilidad asegurarte de que tus datos estén 
            respaldados adecuadamente.
          </p>
        </section>

        <section>
          <h2>4. Disponibilidad del Servicio</h2>
          <p>
            POS Sistema se proporciona "tal cual" sin garantías de ningún tipo. 
            No garantizamos que la aplicación esté disponible en todo momento o libre de errores.
          </p>
        </section>

        <section>
          <h2>5. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar o discontinuar la aplicación en cualquier momento 
            sin previo aviso.
          </p>
        </section>

        <section>
          <h2>6. Limitación de Responsabilidad</h2>
          <p>
            En la medida máxima permitida por la ley, no seremos responsables por cualquier daño 
            directo, indirecto, incidental o consecuente que resulte del uso de esta aplicación.
          </p>
        </section>

        <section>
          <h2>7. Propiedad Intelectual</h2>
          <p>
            El código de POS Sistema está disponible como código abierto. 
            Puedes usar, modificar y distribuir el código según la licencia del proyecto.
          </p>
        </section>

        <section>
          <h2>8. Cambios a los Términos</h2>
          <p>
            Podemos actualizar estos términos de servicio ocasionalmente. 
            La fecha de la última actualización se mostrará en la parte superior de esta página.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;

