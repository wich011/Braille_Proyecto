// Añadir estas funciones al final de tu archivo script.js existente

// Función para inicializar el reconocimiento de voz
let recognition;
let isListening = false;

function setupSpeechRecognition() {
    // Comprobar si el navegador soporta reconocimiento de voz
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Tu navegador no soporta el reconocimiento de voz. Intenta con Chrome o Edge.');
        return false;
    }
    
    // Crear instancia de reconocimiento de voz
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    // Configurar opciones
    recognition.lang = 'es-ES'; // Reconocimiento en español
    recognition.continuous = true; // Reconocimiento continuo
    recognition.interimResults = true; // Obtener resultados intermedios
    
    // Evento cuando se detecta una palabra o frase
    recognition.onresult = function(event) {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        
        // Procesar el texto reconocido
        processVoiceInput(text);
    };
    
    // Manejar errores
    recognition.onerror = function(event) {
        console.error('Error en reconocimiento de voz:', event.error);
        toggleVoiceRecognition(); // Detener el reconocimiento en caso de error
    };
    
    // Cuando el reconocimiento termina
    recognition.onend = function() {
        if (isListening) {
            recognition.start(); // Reiniciar si todavía estamos en modo de escucha
        } else {
            updateMicrophoneButton(false);
        }
    };
    
    return true;
}

// Función para procesar el texto dictado
function processVoiceInput(text) {
    // Limpiar salidas actuales
    document.getElementById('spanish-output').textContent = '';
    document.getElementById('braille-output').textContent = '';
    
    // Procesar cada carácter del texto
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        
        if (char === ' ') {
            // Manejar espacios
            appendToOutput(' ', [0,0,0,0,0,0]);
        } else if (brailleAlphabet[char]) {
            // Manejar letras
            if (text[i] === char.toUpperCase()) {
                // Es una letra mayúscula, agregar indicador de mayúscula
                const brailleChar = getBrailleUnicode(uppercaseIndicator);
                document.getElementById('braille-output').textContent += brailleChar;
            }
            appendToOutput(text[i], brailleAlphabet[char]);
        } else if (brailleNumbers[char]) {
            // Manejar números
            // Agregar indicador de número para el primer dígito en una secuencia
            if (i === 0 || !brailleNumbers[text[i-1]]) {
                const brailleChar = getBrailleUnicode(numberIndicator);
                document.getElementById('braille-output').textContent += brailleChar;
            }
            appendToOutput(char, brailleNumbers[char]);
        } else if (braillePunctuation[char]) {
            // Manejar signos de puntuación
            appendToOutput(char, braillePunctuation[char]);
        } else if (brailleSymbols[char]) {
            // Manejar símbolos
            appendToOutput(char, brailleSymbols[char]);
        }
        // Ignorar caracteres que no están mapeados
    }
}

// Función para alternar el reconocimiento de voz
function toggleVoiceRecognition() {
    if (!recognition) {
        if (!setupSpeechRecognition()) return;
    }
    
    if (isListening) {
        // Detener el reconocimiento
        recognition.stop();
        isListening = false;
        updateMicrophoneButton(false);
    } else {
        // Iniciar el reconocimiento
        try {
            recognition.start();
            isListening = true;
            updateMicrophoneButton(true);
        } catch (e) {
            console.error('Error al iniciar el reconocimiento de voz:', e);
            alert('Error al iniciar el reconocimiento de voz. Intenta recargar la página.');
        }
    }
}

// Función para actualizar el estado visual del botón del micrófono
function updateMicrophoneButton(isActive) {
    const micButton = document.getElementById('mic-button');
    if (isActive) {
        micButton.classList.add('active');
        micButton.innerHTML = '<span class="mic-icon">🎙️</span> Detener';
    } else {
        micButton.classList.remove('active');
        micButton.innerHTML = '<span class="mic-icon">🎙️</span> Hablar';
    }
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