# Problemas Identificados - Metawork-fosis

## Análisis del Sitio Actual

### Problemas Principales:

1. **Órbita Rotando pero Botones No Giran Correctamente**
   - La órbita tiene animación `rotate 15s linear infinite`
   - Los botones usan `transform-origin: 200px` pero esto no es correcto
   - Los botones no contrarrestan la rotación de la órbita
   - Los botones deben tener rotación inversa para mantener su orientación

2. **Menú Radial (Overlay UI)**
   - El menú radial está funcionando correctamente
   - Los botones flotantes se despliegan en forma de diamante
   - El menú se abre y cierra correctamente

3. **Responsive Design**
   - El CSS tiene media queries pero los valores de translateY están hardcodeados
   - En móviles, los botones pueden no posicionarse correctamente
   - El tamaño de la órbita cambia pero los botones pueden desalinearse

4. **Animaciones de Rotación**
   - Los botones de órbita no tienen rotación inversa para contrarrestar la órbita
   - Esto hace que los iconos giren junto con la órbita en lugar de mantenerse orientados

### Soluciones a Implementar:

1. **Agregar Rotación Inversa a Botones de Órbita**
   - Cada botón debe tener una rotación inversa a la órbita
   - Usar CSS variables para calcular la rotación correcta

2. **Mejorar Posicionamiento con transform-origin**
   - El `transform-origin` debe ser el centro de la órbita
   - Usar cálculos correctos para la distancia radial

3. **Optimizar para Móviles**
   - Asegurar que los botones se posicionen correctamente en todos los tamaños
   - Usar valores relativos en lugar de hardcodeados

4. **Agregar Animación de Contrarotación**
   - Los botones deben tener una animación que contrarreste la rotación de la órbita
   - Esto mantendrá los iconos en su orientación correcta
