// Definiciones del alfabeto Braille y caracteres Unicode correspondientes
const brailleAlphabet = {
    // Minúsculas
    'a': [1,0,0,0,0,0], 'b': [1,1,0,0,0,0], 'c': [1,0,0,1,0,0],
    'd': [1,0,0,1,1,0], 'e': [1,0,0,0,1,0], 'f': [1,1,0,1,0,0],
    'g': [1,1,0,1,1,0], 'h': [1,1,0,0,1,0], 'i': [0,1,0,1,0,0],
    'j': [0,1,0,1,1,0], 'k': [1,0,1,0,0,0], 'l': [1,1,1,0,0,0],
    'm': [1,0,1,1,0,0], 'n': [1,0,1,1,1,0], 'ñ': [1,1,1,1,0,1],
    'o': [1,0,1,0,1,0], 'p': [1,1,1,1,0,0], 'q': [1,1,1,1,1,0],
    'r': [1,1,1,0,1,0], 's': [0,1,1,1,0,0], 't': [0,1,1,1,1,0],
    'u': [1,0,1,0,0,1], 'v': [1,1,1,0,0,1], 'w': [0,1,0,1,1,1],
    'x': [1,0,1,1,0,1], 'y': [1,0,1,1,1,1], 'z': [1,0,1,0,1,1]
};

// Indicador de mayúsculas (se coloca antes de una letra)
const uppercaseIndicator = [0,0,0,0,0,1];

// Indicador de número (se coloca antes de un número)
const numberIndicator = [0,0,1,1,1,1];

// Números (utilizan los mismos patrones que las primeras 10 letras)
const brailleNumbers = {
    '1': [1,0,0,0,0,0], '2': [1,1,0,0,0,0], '3': [1,0,0,1,0,0],
    '4': [1,0,0,1,1,0], '5': [1,0,0,0,1,0], '6': [1,1,0,1,0,0],
    '7': [1,1,0,1,1,0], '8': [1,1,0,0,1,0], '9': [0,1,0,1,0,0],
    '0': [0,1,0,1,1,0]
};

// Signos de puntuación
const braillePunctuation = {
    '.': [0,0,1,1,0,1], ',': [0,1,0,0,0,0], ';': [0,1,1,0,0,0],
    ':': [0,1,0,0,1,0], '?': [0,1,0,0,0,1], '!': [0,1,1,0,1,0],
    '"': [0,1,1,0,0,1], '(': [0,1,1,0,1,1], ')': [0,1,1,0,1,1],
    '-': [0,0,1,0,0,1], '\'': [0,0,1,0,0,0]
};

// Símbolos adicionales
const brailleSymbols = {
    '+': [0,0,1,1,0,1], '-': [0,0,1,0,0,1], '*': [0,0,1,0,1,0],
    '/': [0,0,0,1,1,0], '=': [0,0,1,1,1,0], '@': [0,0,1,1,1,0],
    '#': [0,0,1,1,1,1], '%': [0,0,1,0,1,1], '&': [1,1,1,1,0,1],
    '_': [0,0,0,1,0,1], '€': [0,0,0,1,1,1], '$': [0,0,1,1,0,0]
};

// Mapeo de patrones braille a caracteres Unicode de braille
const braillePatternToUnicode = {};

// Generar el mapeo para todos los patrones posibles
function generateBrailleUnicodeMap() {
    // El rango Unicode para los caracteres Braille va de U+2800 a U+28FF
    // U+2800 es el carácter base (todos los puntos desactivados)
    const brailleBaseCodePoint = 0x2800;
    
    // Para cada patrón posible
    for (let i = 0; i < 64; i++) {
        let dots = [];
        // Convertir el número a un patrón de 6 bits
        for (let j = 0; j < 6; j++) {
            dots.push((i >> j) & 1);
        }
        
        // Calcular el valor Unicode
        let unicodeValue = brailleBaseCodePoint;
        for (let j = 0; j < 6; j++) {
            if (dots[j]) {
                // Los bits se asignan según la especificación Unicode para Braille
                // Los puntos 1-6 corresponden a bits específicos en el código Unicode
                unicodeValue |= (1 << (j === 0 ? 0 : j === 1 ? 1 : j === 2 ? 2 : j === 3 ? 3 : j === 4 ? 4 : 5));
            }
        }
        
        // Guardar el mapeo del patrón al carácter Unicode
        const key = dots.join(',');
        braillePatternToUnicode[key] = String.fromCodePoint(unicodeValue);
    }
}

// Generar el mapeo al inicio
generateBrailleUnicodeMap();

// Función para obtener el carácter Unicode Braille para un patrón dado
function getBrailleUnicode(pattern) {
    const key = pattern.join(',');
    return braillePatternToUnicode[key] || '⠿'; // Carácter por defecto si no se encuentra
}

// Crear botón de Braille
function createBrailleButton(character, pattern) {
    const button = document.createElement('button');
    button.className = 'braille-button';
    
    // Crear el patrón de puntos Braille
    const braillePattern = document.createElement('div');
    braillePattern.className = 'braille-pattern';
    
    for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = pattern[i] ? 'braille-dot active' : 'braille-dot';
        // Cambiar el estilo para puntos activos
        if (pattern[i]) {
            dot.style.backgroundColor = '#000';
            dot.style.border = '1px solid #000';
        }
        braillePattern.appendChild(dot);
    }
    
    // Crear etiqueta para el carácter
    const charLabel = document.createElement('div');
    charLabel.className = 'character-label';
    charLabel.textContent = character;
    
    button.appendChild(braillePattern);
    button.appendChild(charLabel);
    
    // Agregar evento de clic
    button.addEventListener('click', function() {
        appendToOutput(character, pattern);
    });
    
    return button;
}

// Función para manejar la salida
function appendToOutput(character, pattern) {
    const spanishOutput = document.getElementById('spanish-output');
    const brailleOutput = document.getElementById('braille-output');
    
    // Actualizar salida en español
    spanishOutput.textContent += character;
    
    // Actualizar salida en braille
    const brailleChar = getBrailleUnicode(pattern);
    brailleOutput.textContent += brailleChar;
}

// Variables globales para el reconocimiento de voz
let recognition;
let isListening = false;

// Función para alternar el reconocimiento de voz
function toggleVoiceRecognition() {
    const micButton = document.getElementById('mic-button');
    
    // Comprobar si el navegador soporta la API de reconocimiento de voz
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Tu navegador no soporta la API de reconocimiento de voz. Intenta con Chrome o Edge.');
        return;
    }
    
    // Inicializar el objeto de reconocimiento si no existe
    if (!recognition) {
        // Usar la API estándar o la versión de webkit según disponibilidad
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        
        // Configurar el reconocimiento
        recognition.lang = 'es-ES';  // Establecer el idioma a español
        recognition.interimResults = false;  // Solo queremos resultados finales
        recognition.continuous = false;  // Reconocimiento no continuo para mejor control
        
        // Evento cuando se detecta un resultado
        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript.toLowerCase();
            console.log('Resultado de voz:', speechResult);
            
            // Procesar cada carácter del resultado y añadirlo a la salida
            for (let i = 0; i < speechResult.length; i++) {
                const char = speechResult[i];
                
                // Minúsculas
                if (brailleAlphabet[char]) {
                    appendToOutput(char, brailleAlphabet[char]);
                }
                // Números
                else if (brailleNumbers[char]) {
                    appendToOutput(char, brailleNumbers[char]);
                }
                // Signos de puntuación
                else if (braillePunctuation[char]) {
                    appendToOutput(char, braillePunctuation[char]);
                }
                // Espacio
                else if (char === ' ') {
                    const spanishOutput = document.getElementById('spanish-output');
                    const brailleOutput = document.getElementById('braille-output');
                    spanishOutput.textContent += ' ';
                    brailleOutput.textContent += ' ';
                }
            }
        };
        
        // Evento cuando termina el reconocimiento
        recognition.onend = function() {
            isListening = false;
            micButton.innerHTML = '<span class="mic-icon">🎙️</span> Hablar';
            micButton.classList.remove('active');
        };
        
        // Evento en caso de error
        recognition.onerror = function(event) {
            console.error('Error en reconocimiento de voz:', event.error);
            isListening = false;
            micButton.innerHTML = '<span class="mic-icon">🎙️</span> Hablar';
            micButton.classList.remove('active');
            alert('Error en el reconocimiento de voz: ' + event.error);
        };
    }
    
    // Alternar entre iniciar y detener el reconocimiento
    if (isListening) {
        recognition.stop();
        isListening = false;
        micButton.innerHTML = '<span class="mic-icon">🎙️</span> Hablar';
        micButton.classList.remove('active');
    } else {
        recognition.start();
        isListening = true;
        micButton.innerHTML = '<span class="mic-icon">🎙️</span> Escuchando...';
        micButton.classList.add('active');
    }
}

// Función para manejar la entrada de teclado y traducirla a braille
function setupKeyboardInput() {
    // Crear un campo de entrada para escribir con el teclado
    const inputSection = document.createElement('div');
    inputSection.className = 'keyboard-input-section';
    
    const inputLabel = document.createElement('div');
    inputLabel.className = 'output-label';
    inputLabel.textContent = 'Escribir con teclado:';
    
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'keyboard-input';
    inputField.className = 'keyboard-input';
    inputField.placeholder = 'Escribe aquí y presiona Enter para traducir';
    
    inputSection.appendChild(inputLabel);
    inputSection.appendChild(inputField);
    
    // Insertar después de los botones de control
    const controlButtons = document.querySelector('.control-buttons');
    controlButtons.parentNode.insertBefore(inputSection, controlButtons.nextSibling);
    
    // Manejar el evento de entrada de teclado
    inputField.addEventListener('keydown', function(event) {
        // Si se presiona Enter, procesar el texto completo
        if (event.key === 'Enter') {
            event.preventDefault();
            processText(this.value);
            this.value = ''; // Limpiar el campo después de procesar
        }
    });
    
    // También podemos procesar cada tecla mientras se escribe (opcional)
    inputField.addEventListener('input', function() {
        // Opcional: procesamiento en tiempo real mientras se escribe
        // El código está comentado para evitar problemas de rendimiento o comportamiento no deseado
        // Si deseas activarlo, descomentar la siguiente línea:
        // processLastCharacter(this.value);
    });
    
    // Añadir botón para traducir (alternativa a Enter)
    const translateButton = document.createElement('button');
    translateButton.id = 'translate-button';
    translateButton.className = 'control-button translate-button';
    translateButton.textContent = 'Traducir';
    translateButton.addEventListener('click', function() {
        processText(inputField.value);
        inputField.value = ''; // Limpiar el campo después de procesar
    });
    
    inputSection.appendChild(translateButton);
    
    // Añadir estilo para el campo de entrada
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-input-section {
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .keyboard-input {
            padding: 10px;
            width: 80%;
            max-width: 500px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .translate-button {
            background-color: #9b59b6;
        }
        
        .translate-button:hover {
            background-color: #8e44ad;
        }
        
        .mic-button.active {
            background-color: #e74c3c;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Función para procesar todo el texto ingresado
function processText(text) {
    if (!text) return;
    
    // Limpiar salidas actuales si se desea
    // Si prefieres mantener el texto existente, comenta estas líneas:
    // document.getElementById('spanish-output').textContent = '';
    // document.getElementById('braille-output').textContent = '';
    
    // Procesar cada carácter
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase(); // Convertir a minúscula para la comparación
        
        // Verificar si es una letra mayúscula en el texto original
        const isUpperCase = text[i] !== char && /[A-Z]/.test(text[i]);
        
        if (isUpperCase && brailleAlphabet[char]) {
            // Para mayúsculas, primero agregamos el indicador y luego la letra
            const spanishOutput = document.getElementById('spanish-output');
            const brailleOutput = document.getElementById('braille-output');
            
            // Agregamos la letra mayúscula al texto en español
            spanishOutput.textContent += text[i];
            
            // Para braille, agregamos el indicador de mayúscula y luego el carácter
            brailleOutput.textContent += getBrailleUnicode(uppercaseIndicator);
            brailleOutput.textContent += getBrailleUnicode(brailleAlphabet[char]);
        }
        // Minúsculas
        else if (brailleAlphabet[char]) {
            appendToOutput(char, brailleAlphabet[char]);
        }
        // Números - verificamos si es un dígito
        else if (/[0-9]/.test(char) && brailleNumbers[char]) {
            const spanishOutput = document.getElementById('spanish-output');
            const brailleOutput = document.getElementById('braille-output');
            
            // Agregamos el número al texto en español
            spanishOutput.textContent += char;
            
            // Para braille, agregamos el indicador de número y luego el carácter
            brailleOutput.textContent += getBrailleUnicode(numberIndicator);
            brailleOutput.textContent += getBrailleUnicode(brailleNumbers[char]);
        }
        // Signos de puntuación
        else if (braillePunctuation[char]) {
            appendToOutput(char, braillePunctuation[char]);
        }
        // Símbolos
        else if (brailleSymbols[char]) {
            appendToOutput(char, brailleSymbols[char]);
        }
        // Espacio
        else if (char === ' ') {
            const spanishOutput = document.getElementById('spanish-output');
            const brailleOutput = document.getElementById('braille-output');
            spanishOutput.textContent += ' ';
            brailleOutput.textContent += ' ';
        }
        // Carácter no reconocido
        else {
            // Simplemente agregamos el carácter original sin traducción
            const spanishOutput = document.getElementById('spanish-output');
            spanishOutput.textContent += text[i];
        }
    }
}

// Función para procesar solo el último carácter ingresado (útil para traducción en tiempo real)
function processLastCharacter(text) {
    if (!text) return;
    const lastChar = text[text.length - 1];
    // El resto de la lógica sería similar a processText pero solo para lastChar
    // Esta función es opcional y no está implementada completamente
}

// Inicializar el botón cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Añadir el código de inicialización después de tu código existente
    
    // Crear el botón de micrófono y añadirlo a los botones de control
    const controlButtons = document.querySelector('.control-buttons');
    const micButton = document.createElement('button');
    micButton.id = 'mic-button';
    micButton.className = 'control-button mic-button';
    micButton.innerHTML = '<span class="mic-icon">🎙️</span> Hablar';
    
    // Añadir evento de clic al botón
    micButton.addEventListener('click', toggleVoiceRecognition);
    
    // Añadir el botón al DOM
    controlButtons.appendChild(micButton);
    
    // El resto de tu código de inicialización existente permanece igual
});

// Función que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de letras minúsculas
    const lowercaseContainer = document.getElementById('lowercase-container');
    for (const char in brailleAlphabet) {
        const button = createBrailleButton(char, brailleAlphabet[char]);
        lowercaseContainer.appendChild(button);
    }
    
    // Configurar botones de letras mayúsculas
    const uppercaseContainer = document.getElementById('uppercase-container');
    for (const char in brailleAlphabet) {
        const upperChar = char.toUpperCase();
        // Para representar una mayúscula en Braille, usaríamos el indicador de mayúscula seguido del patrón de la letra
        const button = createBrailleButton(upperChar, brailleAlphabet[char]);
        uppercaseContainer.appendChild(button);
    }
    
    // Configurar botones de números
    const numbersContainer = document.getElementById('numbers-container');
    for (const num in brailleNumbers) {
        const button = createBrailleButton(num, brailleNumbers[num]);
        numbersContainer.appendChild(button);
    }
    
    // Configurar botones de signos de puntuación
    const punctuationContainer = document.getElementById('punctuation-container');
    for (const punct in braillePunctuation) {
        const button = createBrailleButton(punct, braillePunctuation[punct]);
        punctuationContainer.appendChild(button);
    }
    
    // Configurar botones de símbolos
    const symbolsContainer = document.getElementById('symbols-container');
    for (const symbol in brailleSymbols) {
        const button = createBrailleButton(symbol, brailleSymbols[symbol]);
        symbolsContainer.appendChild(button);
    }
    
    // Configurar botones de control
    document.getElementById('space-button').addEventListener('click', function() {
        const spanishOutput = document.getElementById('spanish-output');
        const brailleOutput = document.getElementById('braille-output');
        
        spanishOutput.textContent += ' ';
        brailleOutput.textContent += ' ';
    });
    
    document.getElementById('backspace-button').addEventListener('click', function() {
        const spanishOutput = document.getElementById('spanish-output');
        const brailleOutput = document.getElementById('braille-output');
        
        spanishOutput.textContent = spanishOutput.textContent.slice(0, -1);
        brailleOutput.textContent = brailleOutput.textContent.slice(0, -1);
    });
    
    document.getElementById('clear-button').addEventListener('click', function() {
        document.getElementById('spanish-output').textContent = '';
        document.getElementById('braille-output').textContent = '';
    });
    
    // Configurar la entrada por teclado
    setupKeyboardInput();
});