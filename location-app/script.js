// Configuração global
const APP_CONFIG = {
    defaultCountry: 'Brasil',
    requiredFields: ['cidade', 'estado'],
    apis: {
        geocoding: 'https://nominatim.openstreetmap.org/search',
        airQuality: 'https://air-quality-api.open-meteo.com/v1/air-quality'
    },
    requestTimeout: 10000 // 10 segundos
};

// Elementos do DOM
const form = document.getElementById('locationForm');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const paisInput = document.getElementById('pais');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

// Seções de resultado
const resultSection = document.getElementById('result');
const locationContent = document.getElementById('locationContent');
const airQualitySection = document.getElementById('airQualityResult');
const airQualityContent = document.getElementById('airQualityContent');
const errorSection = document.getElementById('errorResult');
const errorContent = document.getElementById('errorContent');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configura eventos do formulário
    setupFormEvents();
    
    // Configura validação em tempo real
    setupRealTimeValidation();
    
    // Define país padrão
    paisInput.value = APP_CONFIG.defaultCountry;
    
    console.log('Aplicação de localização inicializada');
}

function setupFormEvents() {
    form.addEventListener('submit', handleFormSubmit);
    
    // Adiciona eventos de limpeza de erro ao digitar
    [cidadeInput, estadoInput, paisInput].forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(input);
        });
        
        input.addEventListener('blur', function() {
            validateField(input);
        });
    });
}

function setupRealTimeValidation() {
    // Validação enquanto o usuário digita (com debounce)
    let validationTimeout;
    
    [cidadeInput, estadoInput].forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => {
                if (input.value.trim().length > 0) {
                    validateField(input);
                }
            }, 500);
        });
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    // Limpa mensagens de erro anteriores
    clearAllErrors();
    hideAllResults();
    
    // Obtém os dados do formulário
    const formData = getFormData();
    
    // Valida todos os campos
    const isValid = validateForm(formData);
    
    if (isValid) {
        lastFormData = formData; // Salva para retry
        processLocationAndAirQuality(formData);
    } else {
        console.log('Formulário contém erros de validação');
    }
}

async function processLocationAndAirQuality(formData) {
    try {
        setLoadingState(true);
        
        // Etapa 1: Geocodificação
        console.log('Buscando coordenadas para:', formData);
        const coordinates = await geocodeLocation(formData);
        
        if (!coordinates) {
            throw new Error('Localização não encontrada. Verifique os dados inseridos.');
        }
        
        displayLocationResult(formData, coordinates);
        
        // Etapa 2: Buscar qualidade do ar
        console.log('Buscando qualidade do ar para:', coordinates);
        const airQualityData = await fetchAirQuality(coordinates);
        
        displayAirQualityResult(airQualityData, coordinates);
        
        console.log('Processo concluído com sucesso');
        
    } catch (error) {
        console.error('Erro ao processar dados:', error);
        displayError(error.message);
    } finally {
        setLoadingState(false);
    }
}

async function geocodeLocation(formData) {
    const query = `${formData.cidade}, ${formData.estado}, ${formData.pais}`;
    const url = `${APP_CONFIG.apis.geocoding}?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeout);
        
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'AirQualityApp/1.0'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro na geocodificação: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
            return null;
        }
        
        const location = data[0];
        return {
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
            displayName: location.display_name,
            address: location.address || {}
        };
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Tempo limite excedido ao buscar localização. Tente novamente.');
        }
        throw new Error(`Erro ao buscar localização: ${error.message}`);
    }
}

async function fetchAirQuality(coordinates) {
    const { latitude, longitude } = coordinates;
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
        timezone: 'auto'
    });
    
    const url = `${APP_CONFIG.apis.airQuality}?${params}`;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.requestTimeout);
        
        const response = await fetch(url, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro na API de qualidade do ar: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.current) {
            throw new Error('Dados de qualidade do ar não disponíveis para esta localização.');
        }
        
        return data;
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Tempo limite excedido ao buscar dados de qualidade do ar. Tente novamente.');
        }
        throw new Error(`Erro ao buscar qualidade do ar: ${error.message}`);
    }
}

function getFormData() {
    return {
        cidade: cidadeInput.value.trim(),
        estado: estadoInput.value.trim(),
        pais: paisInput.value.trim() || APP_CONFIG.defaultCountry
    };
}

function validateForm(data) {
    let isValid = true;
    
    // Validação cidade
    if (!data.cidade) {
        showFieldError('cidade', 'A cidade é obrigatória');
        isValid = false;
    } else if (data.cidade.length < 2) {
        showFieldError('cidade', 'A cidade deve ter pelo menos 2 caracteres');
        isValid = false;
    } else if (!isValidText(data.cidade)) {
        showFieldError('cidade', 'A cidade contém caracteres inválidos');
        isValid = false;
    }
    
    // Validação estado
    if (!data.estado) {
        showFieldError('estado', 'O estado/região é obrigatório');
        isValid = false;
    } else if (data.estado.length < 2) {
        showFieldError('estado', 'O estado deve ter pelo menos 2 caracteres');
        isValid = false;
    } else if (!isValidText(data.estado)) {
        showFieldError('estado', 'O estado contém caracteres inválidos');
        isValid = false;
    }
    
    // Validação país (opcional, mas se preenchido deve ser válido)
    if (data.pais && !isValidText(data.pais)) {
        showFieldError('pais', 'O país contém caracteres inválidos');
        isValid = false;
    }
    
    return isValid;
}

function validateField(input) {
    const fieldName = input.name;
    const value = input.value.trim();
    
    clearFieldError(input);
    
    // Validação específica por campo
    switch (fieldName) {
        case 'cidade':
            if (!value) {
                showFieldError(fieldName, 'A cidade é obrigatória');
                return false;
            } else if (value.length < 2) {
                showFieldError(fieldName, 'A cidade deve ter pelo menos 2 caracteres');
                return false;
            } else if (!isValidText(value)) {
                showFieldError(fieldName, 'A cidade contém caracteres inválidos');
                return false;
            }
            break;
            
        case 'estado':
            if (!value) {
                showFieldError(fieldName, 'O estado/região é obrigatório');
                return false;
            } else if (value.length < 2) {
                showFieldError(fieldName, 'O estado deve ter pelo menos 2 caracteres');
                return false;
            } else if (!isValidText(value)) {
                showFieldError(fieldName, 'O estado contém caracteres inválidos');
                return false;
            }
            break;
            
        case 'pais':
            if (value && !isValidText(value)) {
                showFieldError(fieldName, 'O país contém caracteres inválidos');
                return false;
            }
            break;
    }
    
    // Campo válido
    input.classList.add('success');
    return true;
}

function isValidText(text) {
    // Permite letras, espaços, acentos, hífens e apostrofes
    const validTextPattern = /^[a-zA-ZÀ-ÿ\s\-'.]+$/;
    return validTextPattern.test(text);
}

function showFieldError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (input && errorElement) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
    }
}

function clearFieldError(input) {
    const fieldName = input.name;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    input.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('input');
    
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    inputElements.forEach(input => {
        input.classList.remove('error', 'success');
    });
}

function displayLocationResult(formData, coordinates) {
    locationContent.innerHTML = `
        <div class="location-item">
            <span class="location-label">Cidade:</span>
            <span class="location-value">${escapeHtml(formData.cidade)}</span>
        </div>
        <div class="location-item">
            <span class="location-label">Estado/Região:</span>
            <span class="location-value">${escapeHtml(formData.estado)}</span>
        </div>
        <div class="location-item">
            <span class="location-label">País:</span>
            <span class="location-value">${escapeHtml(formData.pais)}</span>
        </div>
        <div class="location-item">
            <span class="location-label">Coordenadas:</span>
            <span class="location-value">${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}</span>
        </div>
        ${coordinates.displayName ? `
        <div class="location-item">
            <span class="location-label">Endereço Completo:</span>
            <span class="location-value">${escapeHtml(coordinates.displayName)}</span>
        </div>
        ` : ''}
    `;
    
    resultSection.style.display = 'block';
}

function displayAirQualityResult(data, coordinates) {
    const current = data.current;
    const aqi = current.european_aqi || current.us_aqi || 0;
    const aqiInfo = getAQIInfo(aqi);
    
    // Encontra o poluente principal
    const pollutants = {
        'PM2.5': current.pm2_5,
        'PM10': current.pm10,
        'NO₂': current.nitrogen_dioxide,
        'SO₂': current.sulphur_dioxide,
        'O₃': current.ozone,
        'CO': current.carbon_monoxide
    };
    
    const mainPollutant = findMainPollutant(pollutants);
    const healthWarning = getHealthWarning(aqiInfo.category);
    const timestamp = new Date(current.time).toLocaleString('pt-BR');
    
    airQualityContent.innerHTML = `
        <div class="aqi-display">
            <div class="aqi-value ${aqiInfo.class}">${aqi}</div>
            <div class="aqi-info">
                <div class="aqi-category ${aqiInfo.class}">${aqiInfo.category}</div>
                <div class="aqi-description">${aqiInfo.description}</div>
            </div>
        </div>
        
        <div class="pollutant-grid">
            <div class="pollutant-card ${mainPollutant.name === 'PM2.5' ? 'highlight' : ''}">
                <div class="pollutant-name">PM2.5</div>
                <div class="pollutant-value">${current.pm2_5 || 'N/A'} <span class="pollutant-unit">µg/m³</span></div>
            </div>
            <div class="pollutant-card ${mainPollutant.name === 'PM10' ? 'highlight' : ''}">
                <div class="pollutant-name">PM10</div>
                <div class="pollutant-value">${current.pm10 || 'N/A'} <span class="pollutant-unit">µg/m³</span></div>
            </div>
            <div class="pollutant-card ${mainPollutant.name === 'NO₂' ? 'highlight' : ''}">
                <div class="pollutant-name">NO₂</div>
                <div class="pollutant-value">${current.nitrogen_dioxide || 'N/A'} <span class="pollutant-unit">µg/m³</span></div>
            </div>
            <div class="pollutant-card ${mainPollutant.name === 'SO₂' ? 'highlight' : ''}">
                <div class="pollutant-name">SO₂</div>
                <div class="pollutant-value">${current.sulphur_dioxide || 'N/A'} <span class="pollutant-unit">µg/m³</span></div>
            </div>
            <div class="pollutant-card ${mainPollutant.name === 'O₃' ? 'highlight' : ''}">
                <div class="pollutant-name">O₃</div>
                <div class="pollutant-value">${current.ozone || 'N/A'} <span class="pollutant-unit">µg/m³</span></div>
            </div>
            <div class="pollutant-card ${mainPollutant.name === 'CO' ? 'highlight' : ''}">
                <div class="pollutant-name">CO</div>
                <div class="pollutant-value">${current.carbon_monoxide || 'N/A'} <span class="pollutant-unit">µg/m³</span></div>
            </div>
        </div>
        
        ${mainPollutant.name ? `
        <div class="main-pollutant">
            <strong>Poluente Principal:</strong> ${mainPollutant.name} (${mainPollutant.value} µg/m³)
        </div>
        ` : ''}
        
        ${healthWarning ? `
        <div class="health-warning">
            <h4>⚠️ Aviso de Saúde</h4>
            <p>${healthWarning}</p>
        </div>
        ` : ''}
        
        <div class="timestamp">
            Dados atualizados em: ${timestamp}
        </div>
    `;
    
    airQualitySection.style.display = 'block';
    
    // Scroll suave para os resultados
    airQualitySection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

function displayError(message) {
    errorContent.innerHTML = `
        <div class="error-message-api">
            <p><strong>Ops!</strong> ${escapeHtml(message)}</p>
            <button class="retry-button" onclick="retryLastRequest()">
                Tentar Novamente
            </button>
        </div>
    `;
    
    errorSection.style.display = 'block';
    
    errorSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

function clearForm() {
    // Limpa todos os campos
    form.reset();
    
    // Restaura o país padrão
    paisInput.value = APP_CONFIG.defaultCountry;
    
    // Limpa todos os erros e estados
    clearAllErrors();
    
    // Esconde todas as seções de resultado
    hideAllResults();
    
    // Foca no primeiro campo
    cidadeInput.focus();
    
    console.log('Formulário limpo');
}

function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

function hideAllResults() {
    resultSection.style.display = 'none';
    airQualitySection.style.display = 'none';
    errorSection.style.display = 'none';
}

function getAQIInfo(aqi) {
    if (aqi <= 20) {
        return {
            category: 'Boa',
            class: 'aqi-good',
            description: 'A qualidade do ar é considerada satisfatória. A poluição do ar representa pouco ou nenhum risco.'
        };
    } else if (aqi <= 40) {
        return {
            category: 'Razoável',
            class: 'aqi-fair',
            description: 'A qualidade do ar é aceitável para a maioria das pessoas. Grupos sensíveis podem ter sintomas leves.'
        };
    } else if (aqi <= 60) {
        return {
            category: 'Moderada',
            class: 'aqi-moderate',
            description: 'Grupos sensíveis podem apresentar sintomas. O público em geral normalmente não é afetado.'
        };
    } else if (aqi <= 80) {
        return {
            category: 'Ruim',
            class: 'aqi-poor',
            description: 'Pode causar problemas de saúde para grupos sensíveis. O público em geral pode começar a sentir efeitos.'
        };
    } else {
        return {
            category: 'Muito Ruim',
            class: 'aqi-very-poor',
            description: 'Condições de emergência. Toda a população pode ser afetada. Evite atividades ao ar livre.'
        };
    }
}

function findMainPollutant(pollutants) {
    let maxValue = 0;
    let mainPollutant = { name: null, value: null };
    
    for (const [name, value] of Object.entries(pollutants)) {
        if (value && value > maxValue) {
            maxValue = value;
            mainPollutant = { name, value };
        }
    }
    
    return mainPollutant;
}

function getHealthWarning(category) {
    const warnings = {
        'Boa': null,
        'Razoável': 'Pessoas com sensibilidade incomum à poluição do ar devem considerar reduzir atividades prolongadas ao ar livre.',
        'Moderada': 'Pessoas com doenças cardíacas ou pulmonares, adultos mais velhos e crianças devem reduzir atividades prolongadas ao ar livre.',
        'Ruim': 'Pessoas com doenças cardíacas ou pulmonares, adultos mais velhos e crianças devem evitar atividades prolongadas ao ar livre. Todos devem reduzir atividades prolongadas ao ar livre.',
        'Muito Ruim': 'Todos devem evitar atividades ao ar livre. Pessoas com doenças cardíacas ou pulmonares devem permanecer em ambientes fechados e manter atividades no nível mínimo.'
    };
    
    return warnings[category];
}

// Variável global para retry
let lastFormData = null;

function retryLastRequest() {
    if (lastFormData) {
        hideAllResults();
        processLocationAndAirQuality(lastFormData);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Funções utilitárias para debugging
function logFormData() {
    const data = getFormData();
    console.table(data);
}

// Expõe algumas funções globalmente para debugging (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugApp = {
        logFormData,
        clearForm,
        getFormData,
        validateForm
    };
}
