# 🎡 ¡Ruleta Conectando Fronteras! – Semana de la Internacionalización 2026
### Red ORIS IES Nariño • Sede Anfitriona: Universidad CESMAG (Auditorio San Francisco 2)

Aplicación web interactiva, moderna y 100% responsive estilo **TV Game Show Institucional**, diseñada con principios de **Apple HIG Craftsmanship** y sintetizador de sonido en tiempo real con **Web Audio API** (sin dependencias de archivos MP3 externos).

Optimizada especialmente para proyección panorámica en relación de aspecto **16:9** en el Auditorio San Francisco 2 de la Universidad CESMAG, así como para operación desde computadores portátiles y dispositivos móviles.

---

## 🏛️ Contexto Institucional del Conversatorio

Esta ruleta interactiva se proyecta en el cierre magistral del conversatorio:
> **"Conectando Fronteras: Experiencias de Movilidad Estudiantil Entrante y Saliente de las IES de Nariño"**

### 🎓 Las 7 Universidades Fundadoras de la Red ORIS IES Nariño:
1. **Universidad de Nariño**
2. **Universidad Cooperativa de Colombia (UCC)**
3. **Universidad CESMAG** *(Institución Anfitriona del Conversatorio)*
4. **Universidad Mariana**
5. **Fundación Universitaria San Martín**
6. **UNIMINUTO (Corporación Universitaria Minuto de Dios)**
7. **UniCatólica del Sur (Fundación Universitaria Católica del Sur)**

### 🎙️ Moderación Oficial:
* **Profesora Sofía Vallejos** (Directora de la Oficina de Relaciones Nacionales e Internacionales - ORI de la Universidad Mariana).

### 👥 Los 10 Panelistas en Escenario:
* **5 Estudiantes de Movilidad Saliente (Universidad CESMAG):**
  1. **Gladys Anyelynne Coral Riascos** (Derecho – Destino: Universidad de La Guajira, Colombia 🇨🇴)
  2. **Jonathan David López Criollo** (Derecho – Destino: Universidad de La Guajira, Colombia 🇨🇴)
  3. **Thiago Rodríguez Arturo** (Psicología – Destino: Universidad de La Guajira, Colombia 🇨🇴)
  4. **María Camila Parra Cárdenas** (Psicología – Destino: Universidad Católica de Pereira, Colombia 🇨🇴)
  5. **Luisa Fernanda Guerrero Burbano** (Administración de Empresas – Destino: Universidad Veracruzana, México 🇲🇽)
* **4 Estudiantes de Movilidad Internacional Entrante (Universidad Mariana y UCC):**
  6. **Luciana Andrea Valencia Guzmán** (Chile 🇨🇱, Universidad de La Frontera UFRO ➔ Terapia Ocupacional, Universidad Mariana | Becas de Reciprocidad)
  7. **Luz Celene Tello Fernández** (Perú 🇵🇪, Universidad César Vallejo UCV ➔ Psicología, Universidad Mariana | Becas de Reciprocidad)
  8. **Diego Navarrete Salmerón** (México 🇲🇽, Universidad del Valle de Atemajac UNIVA ➔ Mercadeo, Universidad Mariana | Becas de Reciprocidad)
  9. **Lucy Mary Rengifo Arias** (Bolivia 🇧🇴, U. Mayor, Real y Pontificia de San Francisco Xavier de Chuquisaca ➔ Universidad Cooperativa de Colombia UCC | Programa MARCA ARCU-SUR)
* **1 Egresado y Profesional en Ejercicio Invitado Especial:**
  10. **Esteban Paz Arturo** (Egresado de Adm. de Negocios Internacionales de la U. Mariana, Esp. en Gerencia Social de la U. de Nariño, Máster en Negocios Internacionales de la U. Europea de Valencia, con trayectoria en Inglaterra 🇬🇧, España 🇪🇸 y China 🇨🇳, actual Profesional de la Oficina de Asuntos Internacionales de la Alcaldía de Pasto).

---

## 🎯 Reglas de Negocio y Funcionalidades Principales

1. **Nivel de Dificultad Estándar Único:**
   * Las 45 preguntas pertenecen a una categoría única: **"Nivel Estándar – Conectando Fronteras"**. No existen subdivisiones de preguntas fáciles o difíciles.
2. **Número de Premios 100% Personalizable en Vivo:**
   * Marcador en tiempo real: *"Premios Disponibles: X de Y"*, con trofeos gráficos e interactivos.
   * Botones de ajuste inmediato: `+` y `-` en la barra superior.
   * Acceso rápido a configuración con la tecla `P` o el botón *"Ajustar"*.
   * Botones instantáneos: `+1 Premio Extra` y `Reiniciar Contador`.
3. **Cero Pistas en Pantalla (Estricto):**
   * En el modal de la pregunta seleccionada, **no se muestra ninguna pista, inicial ni selección múltiple**.
   * Tipografía gigante en alto contraste pensada para ser leída desde la última fila del auditorio.
   * La respuesta oficial permanece **100% oculta** hasta que el operador presiona *"👁️ Revelar Respuesta Oficial"* o la tecla `R`.
4. **Cronómetro Visual de 15 Segundos:**
   * Anillo y barra de tiempo fluida con controles para iniciar, pausar y reiniciar a 15 segundos.
   * Sonido rítmico de pulso (*countdown tick*) y alerta sonora en los últimos segundos.
5. **Ruleta en HTML5 Canvas Retina / 4K:**
   * Adaptación automática a pantallas de alta densidad mediante `devicePixelRatio`.
   * Luces LED perimetrales con secuencias de encendido y persecución.
   * Física de desaceleración realista con curva `easeOutCubic` (~4.5 segundos).
   * Puntero flapper con rebote mecánico sincronizado con el sonido de las clavijas (*wheel tick*).
   * Eliminación automática de las preguntas premiadas para garantizar que ninguna pregunta ganada se repita.
6. **Pantalla de Gran Final:**
   * Se activa al agotarse los premios o mediante el botón de *"Finalizar"*.
   * Celebración con lluvia de confeti (`canvas-confetti`), mención honorífica a las 7 universidades fundadoras de la Red ORIS IES Nariño y posibilidad de añadir premios extras en vivo si el público solicita otra ronda.

---

## 🔊 Sistema de Sonido (100% Web Audio API Sintetizado)

No requiere conexión a internet para audio ni archivos MP3 externos. La clase `SoundEngine` genera síntesis analógica en tiempo real mediante `AudioContext`:
* `playWheelTick()`: Sonido percusivo de trinquete mecánico con variación orgánica de tono al pasar cada clavija.
* `playQuestionDramaticReveal()`: Efecto de impacto sub-grave y acorde de suspenso televisivo al abrirse la pregunta.
* `playCountdownTick(isUrgent)`: Pulso rítmico sintetizado para los 15 segundos del cronómetro.
* `playAnswerReveal()`: Arpegio celestial de campanas doradas (*chimes*) al revelar la respuesta correcta.
* `playWinnerFanfare()`: Fanfarria de victoria televisiva con arpegio mayor y acorde triunfal orquestal.
* `playWrongBuzzer()`: Zumbador (*buzzer*) característico de concurso televisivo con doble onda en semitono disonante.
* Botón de **Silenciar / Activar Sonido** accesible en el header y con la tecla `M`.

---

## ⌨️ Atajos de Teclado para el Operador en Auditorio

| Tecla | Acción | Contexto |
| :---: | :--- | :--- |
| **`Espacio`** | Girar la ruleta / Iniciar sorteo | Pantalla Principal |
| **`R`** | 👁️ Revelar la respuesta oficial | Modal de Pregunta |
| **`G`** | 🏆 Marcar ganador: Descuenta 1 premio, retira pregunta, lanza confeti y fanfarria | Modal de Pregunta |
| **`B`** | ❌ Sonar buzzer de error / pasar turno (sin descontar premio) | Modal de Pregunta |
| **`P`** | Abrir configuración rápida de premios | Cualquier momento |
| **`Escape`** | Cerrar ventana emergente o modal activo | Modales |
| **`M`** | Silenciar / Activar sonido en tiempo real | Global |
| **`F`** | Activar / Salir de pantalla completa para proyector | Global |

---

## 🛠️ Tecnologías Utilizadas

* **React 19 & TypeScript**
* **Vite 8** (Compilación instantánea en < 700ms)
* **Tailwind CSS v4** (Diseño fluido Apple HIG)
* **HTML5 Canvas 2D** (Renderizado vectorial de alta resolución con soporte Retina / 4K)
* **Web Audio API** (Sintetizador acústico sin archivos externos)
* **Canvas-Confetti** (Animación de partículas de celebración)
* **Lucide React** (Iconografía minimalista)

---

## 🚀 Despliegue en Vercel

La aplicación cuenta con `vercel.json` preconfigurado con enrutamiento SPA y políticas de caché:

1. Importa el repositorio `https://github.com/Tony-1309/RULETA---CONECTANDO-FRONTERAS---ORIS.git` en [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Presiona **Deploy**.

---

## 💻 Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/Tony-1309/RULETA---CONECTANDO-FRONTERAS---ORIS.git

# Entrar al directorio
cd "Ruleta ORIS"

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---
*Desarrollado con dedicación para la Red ORIS IES Nariño y la Universidad CESMAG | Semana de la Internacionalización 2026.*
