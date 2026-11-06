# Re-Late · Ejercicio Saludable

Aplicación web de apoyo para el registro de actividad física y datos
relacionados con la salud cardiovascular.

Re-Late es la Asociación de Enfermos de Rehabilitación Cardiaca.
La aplicación está orientada a sus socios como herramienta de apoyo
para organizar información y compartirla con sus profesionales
sanitarios.

**Estado de esta versión:** revisión funcional y clínica pendiente.
No debe utilizarse con pacientes ni distribuirse como herramienta
validada hasta completar las comprobaciones indicadas en este documento.

## 1. Finalidad y límites

La aplicación permite registrar datos declarados por la persona usuaria
y consultar información general sobre actividad física y rehabilitación
cardíaca.

**No sustituye la valoración, el diagnóstico, la prescripción ni el
seguimiento de un profesional sanitario.** Tampoco determina si una
persona puede realizar ejercicio de forma segura.

En particular:

- La ausencia de síntomas en el cuestionario no es una autorización
  médica para hacer ejercicio.
- El colesterol y el LDL no determinan por sí solos si una actividad
  es segura.
- La aplicación no calcula automáticamente una zona de frecuencia
  cardíaca segura a partir de la edad o de una prueba de esfuerzo.
- Los resultados de las valoraciones funcionales se registran sin
  clasificación diagnóstica automática.
- Las actividades del catálogo son ejemplos informativos, no programas
  de ejercicio individualizados.
- Los límites de entrada de los formularios sirven para detectar
  posibles errores; no son objetivos ni límites clínicos seguros.

Cada persona debe seguir las indicaciones de su equipo sanitario.

### Síntomas de alarma

Ante dolor u opresión en el pecho, falta de aire importante, desmayo,
mareo intenso u otros síntomas preocupantes, se debe detener la actividad.

Si los síntomas son graves o persistentes, se debe llamar al **112 en
España** o al número de emergencias local. Ante otros síntomas nuevos
o preocupantes, se debe contactar con el equipo sanitario y seguir
sus indicaciones.

La aplicación no es un sistema de emergencias ni garantiza la detección
de síntomas o el envío de avisos.

## 2. Funciones de la versión revisada

### Inicio y consejos

- Información general y advertencias de uso.
- Consejos sobre actividad física, alimentación, tabaco y estrés.
- Enlaces a recursos externos de distintas organizaciones.

Los enlaces externos requieren conexión a internet. Su disponibilidad,
contenido y adecuación deben revisarse antes de publicar la aplicación.

### Salud

- Perfil con antecedentes, medicación e indicaciones de ejercicio
  introducidas por la persona usuaria.
- Registro de colesterol total, LDL y objetivo de LDL indicado por
  un profesional.
- Registro de peso, perímetro abdominal, pulso, tensión, glucemia
  y notas.
- Historiales y gráficas cuando la biblioteca de gráficas está
  disponible.
- Recordatorios de medicación u otros eventos.

Los valores registrados requieren interpretación profesional. La
aplicación no modifica tratamientos ni proporciona un diagnóstico.

### Ejercicio

- Cuestionario de síntomas previo a la actividad.
- Lectura puntual de pulso introducida manualmente.
- Conexión opcional a sensores Bluetooth compatibles, cuando el
  navegador y el dispositivo lo permiten.
- Cronómetro y registro orientativo de una marcha de seis minutos,
  con distancia manual o estimada mediante GPS.
- Registro manual de valoraciones funcionales.
- Catálogo de actividades por lugar: aire libre, gimnasio y casa.

El resultado de la marcha **no equivale por sí solo a una prueba
clínica estandarizada de seis minutos**. El GPS puede ser impreciso,
perder señal o producir distancias erróneas. El cronómetro puede verse
afectado si la aplicación pasa a segundo plano.

La lectura manual de pulso es puntual: no proporciona vigilancia
continua. La conexión Bluetooth puede interrumpirse o dejar de recibir
datos. La aplicación no garantiza alarmas ni debe utilizarse como
monitor médico.

### Progreso

- Registro de actividades y de su duración declarada.
- Historiales de sesiones, marchas y valoraciones funcionales.
- Gráficas de actividad y peso, cuando están disponibles.
- Resumen para imprimir o copiar y compartir con un profesional.
- Descarga de una copia de datos en formato JSON.
- Opción de borrar los datos de la versión revisada.

Los historiales visibles y el resumen muestran un número limitado de
registros recientes; la copia JSON contiene los datos de la versión
revisada guardados en el navegador.

## 3. Recordatorios: limitaciones

Los recordatorios intentan emitirse mientras la aplicación está abierta
y el navegador permite su ejecución. Pueden fallar si la aplicación se
cierra, pasa a segundo plano, el dispositivo suspende su ejecución o
las notificaciones están bloqueadas.

**No deben utilizarse como único sistema para recordar la medicación.**

## 4. Datos y privacidad

Los datos introducidos en esta versión se guardan en el almacenamiento
local del navegador del dispositivo. No existe una cuenta de usuario ni
una sincronización entre dispositivos implementada en el código
proporcionado.

Esto implica que:

- Los datos pueden perderse al borrar el almacenamiento del navegador,
  cambiar de dispositivo o por otros problemas del navegador.
- Una persona con acceso al dispositivo o al perfil del navegador
  podría consultar los datos.
- El código no implementa cifrado específico de los registros ni un
  sistema de acceso mediante contraseña.
- Una copia JSON, un resumen copiado o un documento impreso puede
  contener datos sensibles de salud. Debe guardarse y compartirse de
  forma segura.
- Descargar una copia no borra los datos del navegador.
- La versión entregada permite descargar una copia JSON, pero **no
  incluye una función para restaurarla o importarla**.

La aplicación solicita acceso a la ubicación únicamente cuando se usa
el modo GPS y acceso a Bluetooth cuando se intenta conectar un sensor.
El código de la aplicación no incluye una función para enviar los
registros de salud a un servidor propio.

La carga de recursos externos —como Chart.js, Google Fonts o enlaces
a otras páginas— puede comunicar datos técnicos de conexión a sus
respectivos proveedores. El uso de los servicios de ubicación también
depende del navegador, el dispositivo y sus proveedores.

Antes de poner la aplicación a disposición de los socios, Re-Late debe
revisar la información de privacidad, las medidas de seguridad y las
obligaciones legales aplicables al tratamiento de datos de salud.

## 5. Datos de versiones anteriores

La versión revisada utiliza una clave de almacenamiento nueva y **no
importa automáticamente** los registros de la versión anterior. Por
ello, los datos antiguos no aparecen en los historiales ni en el resumen
de esta versión.

La descarga JSON intenta incluir un conjunto de claves antiguas
identificadas en el código. **No está verificado que esa lista contenga
todas las claves utilizadas por el archivo original.**

Antes de sustituir la aplicación anterior:

1. Conserva una copia de los archivos originales.
2. Conserva los datos existentes en el navegador.
3. Descarga una copia JSON y comprueba su contenido en un entorno seguro.
4. Compara las claves reales del archivo original con las incluidas en
   la función `clavesAntiguas()`.
5. Diseña y prueba una migración antes de prometer que todos los datos
   anteriores estarán disponibles en la nueva versión.

El botón de borrar datos de la versión revisada no pretende borrar las
claves antiguas. Esta conducta también debe verificarse antes de la
publicación.

## 6. Archivos y puesta en marcha

Los archivos principales de la aplicación son:

- `index.html`: interfaz, estilos y lógica de la aplicación.
- `sw.js`: *service worker* para el funcionamiento sin conexión.
- `manifest.json`: información utilizada por navegadores compatibles
  para presentar o instalar la aplicación.
- Iconos y otros recursos a los que haga referencia el manifiesto.

Deben mantenerse los nombres y las rutas utilizados por cada archivo.
El `sw.js` proporcionado intenta precargar `index.html` y
`manifest.json`; si alguno no está disponible, la instalación del
*service worker* puede fallar.

Para las funciones que lo requieren, la aplicación debe servirse
mediante **HTTPS** o desde un entorno local compatible, como
`localhost`. Abrir `index.html` directamente desde el disco puede
limitar el funcionamiento del *service worker*, la ubicación,
Bluetooth, las notificaciones u otras funciones.

### Funcionamiento sin conexión

Tras una instalación correcta del *service worker* y la descarga de
los recursos necesarios, parte de la aplicación puede utilizarse sin
conexión.

Limitaciones:

- La primera carga y la preparación de la caché requieren conexión
  cuando la aplicación se aloja en línea.
- Las gráficas dependen de que Chart.js se haya descargado y esté
  disponible; en caso contrario, se muestran mensajes alternativos.
- Los enlaces externos requieren conexión.
- La instalación y el funcionamiento sin conexión dependen del
  navegador, del dispositivo y de la disponibilidad de los recursos.
- Debe comprobarse el comportamiento real después de actualizar
  archivos o cambiar la versión de la caché del *service worker*.

## 7. Comprobaciones pendientes antes de publicar

Esta versión no se ha presentado como ejecutada ni probada en los
dispositivos de los socios. Antes de distribuirla:

1. **Revisión clínica:** revisar textos, síntomas de alarma, catálogo,
   cuestionarios y presentación de los datos con profesionales de
   rehabilitación cardíaca.
2. **Comparación con la versión original:** comprobar que se conservan
   las categorías, actividades, enlaces y funciones que Re-Late desea
   mantener. No se ha verificado que el catálogo enviado sea idéntico
   al original.
3. **Datos antiguos:** identificar todas las claves originales y
   verificar la copia y cualquier procedimiento de migración.
4. **Pruebas funcionales:** comprobar formularios, guardado, historiales,
   gráficas, resumen, copia JSON y borrado.
5. **Pruebas por dispositivo:** comprobar instalación, actualización,
   funcionamiento sin conexión, permisos, GPS, Bluetooth y
   notificaciones en los navegadores y dispositivos previstos.
6. **Seguridad y privacidad:** revisar acceso al dispositivo,
   almacenamiento, recursos externos, copias, documentación legal y
   protección de datos de salud.
7. **Accesibilidad:** comprobar navegación con teclado, lectores de
   pantalla, tamaños de texto, contraste y uso en móviles.

Cualquier incidencia debe corregirse y volver a probarse antes de
utilizar la aplicación con pacientes.
