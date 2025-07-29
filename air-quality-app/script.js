// Elementos do DOM
const locationForm = document.getElementById('locationForm');
const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const countryInput = document.getElementById('country');
const submitBtn = document.querySelector('.submit-btn');
const errorMessage = document.getElementById('errorMessage');
const results = document.getElementById('results');
const locationInfo = document.getElementById('locationInfo');

// Estado da aplicação
let isFormSubmitting = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupFormValidation();
    console.log('🌬️ Aplicação de Qualidade do Ar inicializada');
}

function setupEventListeners() {
    // Submit do formulário
    locationForm.addEventListener('submit', handleFormSubmit);
    
    // Validação em tempo real
    cityInput.addEventListener('input', validateField);
    stateInput.addEventListener('input', validateField);
    countryInput.addEventListener('input', validateField);
    
    // Limpar mensagens de erro ao focar nos campos
    [cityInput, stateInput, countryInput].forEach(input => {
        input.addEventListener('focus', clearFieldError);
    });
}

function setupFormValidation() {
    // Define o país padrão se estiver vazio
    if (!countryInput.value.trim()) {
        countryInput.value = 'EUA';
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (isFormSubmitting) return;
    
    clearMessages();
    
    // Validar formulário
    if (!validateForm()) {
        return;
    }
    
    // Preparar dados
    const formData = getFormData();
    
    try {
        isFormSubmitting = true;
        setLoadingState(true);
        
        // Simular processamento (aqui será onde chamaremos as APIs no próximo passo)
        await processLocationAndAirQuality(formData);
        
    } catch (error) {
        console.error('Erro ao processar localização:', error);
        showError('Erro interno da aplicação. Tente novamente.');
    } finally {
        isFormSubmitting = false;
        setLoadingState(false);
    }
}

function validateForm() {
    let isValid = true;
    
    // Validar cidade
    if (!validateRequired(cityInput)) {
        showFieldError(cityInput, 'Cidade é obrigatória');
        isValid = false;
    } else if (!validateMinLength(cityInput, 2)) {
        showFieldError(cityInput, 'Cidade deve ter pelo menos 2 caracteres');
        isValid = false;
    }
    
    // Validar estado
    if (!validateRequired(stateInput)) {
        showFieldError(stateInput, 'Estado/Província/Região é obrigatório');
        isValid = false;
    } else if (!validateMinLength(stateInput, 2)) {
        showFieldError(stateInput, 'Estado deve ter pelo menos 2 caracteres');
        isValid = false;
    }
    
    // Validar país (opcional, mas se preenchido deve ser válido)
    if (countryInput.value.trim() && !validateMinLength(countryInput, 2)) {
        showFieldError(countryInput, 'País deve ter pelo menos 2 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function validateField(event) {
    const input = event.target;
    clearFieldError(input);
    
    if (input === cityInput || input === stateInput) {
        if (input.value.trim() && validateMinLength(input, 2)) {
            markFieldValid(input);
        } else if (input.value.trim()) {
            markFieldError(input);
        }
    }
}

function validateRequired(input) {
    return input.value.trim().length > 0;
}

function validateMinLength(input, minLength) {
    return input.value.trim().length >= minLength;
}

function getFormData() {
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();
    let country = countryInput.value.trim();
    
    // Se país estiver vazio, usar EUA como padrão
    if (!country) {
        country = 'EUA';
        countryInput.value = country;
    }
    
    return {
        city,
        state,
        country,
        fullLocation: `${city}, ${state}, ${country}`
    };
}

// APIs Configuration
const API_CONFIG = {
    nominatim: {
        baseUrl: 'https://nominatim.openstreetmap.org/search',
        format: 'json',
        limit: 1
    },
    openMeteo: {
        baseUrl: 'https://air-quality-api.open-meteo.com/v1/air-quality',
        current: 'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone'
    }
};

// Índices de qualidade do ar e suas descrições
const AQI_LEVELS = {
    european: {
        1: { label: 'Boa', color: '#00e400', description: 'Qualidade do ar satisfatória' },
        2: { label: 'Razoável', color: '#ffff00', description: 'Qualidade do ar aceitável para a maioria das pessoas' },
        3: { label: 'Moderada', color: '#ff7e00', description: 'Grupos sensíveis podem experimentar sintomas menores' },
        4: { label: 'Ruim', color: '#ff0000', description: 'Prejudicial para grupos sensíveis' },
        5: { label: 'Muito Ruim', color: '#8f3f97', description: 'Prejudicial para todos' },
        6: { label: 'Extremamente Ruim', color: '#7e0023', description: 'Emergência de saúde' }
    },
    us: {
        1: { label: 'Boa', color: '#00e400', description: 'Qualidade do ar satisfatória' },
        2: { label: 'Moderada', color: '#ffff00', description: 'Aceitável para a maioria das pessoas' },
        3: { label: 'Prejudicial para Grupos Sensíveis', color: '#ff7e00', description: 'Grupos sensíveis podem ter problemas' },
        4: { label: 'Prejudicial', color: '#ff0000', description: 'Todos podem começar a sentir efeitos' },
        5: { label: 'Muito Prejudicial', color: '#8f3f97', description: 'Aviso de saúde' },
        6: { label: 'Perigosa', color: '#7e0023', description: 'Emergência de saúde' }
    }
};

async function processLocationAndAirQuality(formData) {
    try {
        // Passo 1: Geocodificação
        console.log('🌍 Buscando coordenadas para:', formData.fullLocation);
        const coordinates = await geocodeLocation(formData);
        
        if (!coordinates) {
            throw new Error('LOCATION_NOT_FOUND');
        }
        
        // Passo 2: Buscar dados de qualidade do ar
        console.log('🌬️ Buscando dados de qualidade do ar para:', coordinates);
        const airQualityData = await fetchAirQualityData(coordinates);
        
        // Passo 3: Exibir resultados
        showAirQualityResults(formData, coordinates, airQualityData);
        
    } catch (error) {
        console.error('Erro ao processar localização e qualidade do ar:', error);
        handleAPIError(error);
    }
}

async function geocodeLocation(formData) {
    const query = encodeURIComponent(formData.fullLocation);
    const url = `${API_CONFIG.nominatim.baseUrl}?q=${query}&format=${API_CONFIG.nominatim.format}&limit=${API_CONFIG.nominatim.limit}&addressdetails=1`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AirQualityApp/1.0 (Workshop Sinquia Evertec)'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
            return null;
        }
        
        const location = data[0];
        return {
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon),
            displayName: location.display_name,
            address: location.address || {}
        };
        
    } catch (error) {
        console.error('Erro na geocodificação:', error);
        throw new Error('GEOCODING_ERROR');
    }
}

async function fetchAirQualityData(coordinates) {
    const url = `${API_CONFIG.openMeteo.baseUrl}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=${API_CONFIG.openMeteo.current}&timezone=auto`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.current) {
            throw new Error('Dados de qualidade do ar não disponíveis');
        }
        
        return {
            current: data.current,
            timezone: data.timezone,
            units: data.current_units || {}
        };
        
    } catch (error) {
        console.error('Erro ao buscar dados de qualidade do ar:', error);
        throw new Error('AIR_QUALITY_API_ERROR');
    }
}

function showAirQualityResults(formData, coordinates, airQualityData) {
    const { current, timezone, units } = airQualityData;
    
    // Determinar o poluente principal e nível de IQA
    const aqiInfo = determineAQILevel(current);
    const pollutants = formatPollutantData(current, units);
    const timestamp = new Date(current.time).toLocaleString('pt-BR', {
        timeZone: timezone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    locationInfo.innerHTML = `
        <div class="air-quality-header">
            <h3>📍 ${coordinates.address.city || coordinates.address.town || coordinates.address.village || formData.city}</h3>
            <p class="location-details">${coordinates.displayName}</p>
            <p class="coordinates">Coordenadas: ${coordinates.lat.toFixed(4)}, ${coordinates.lon.toFixed(4)}</p>
        </div>
        
        <div class="aqi-main-info">
            <div class="aqi-circle" style="background-color: ${aqiInfo.color}">
                <div class="aqi-value">${aqiInfo.value || 'N/A'}</div>
                <div class="aqi-type">${aqiInfo.type}</div>
            </div>
            <div class="aqi-description">
                <h4>${aqiInfo.label}</h4>
                <p>${aqiInfo.description}</p>
                ${aqiInfo.healthAdvice ? `<div class="health-advice">💡 ${aqiInfo.healthAdvice}</div>` : ''}
            </div>
        </div>
        
        <div class="pollutants-grid">
            ${pollutants.map(pollutant => `
                <div class="pollutant-card ${pollutant.isMain ? 'main-pollutant' : ''}">
                    <div class="pollutant-name">${pollutant.name}</div>
                    <div class="pollutant-value">${pollutant.value} ${pollutant.unit}</div>
                    ${pollutant.isMain ? '<div class="main-indicator">Poluente Principal</div>' : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="measurement-info">
            <p><strong>⏰ Última medição:</strong> ${timestamp}</p>
            <p><strong>🕐 Fuso horário:</strong> ${timezone}</p>
        </div>
    `;
    
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth' });
}

function determineAQILevel(current) {
    const europeanAqi = current.european_aqi;
    const usAqi = current.us_aqi;
    
    // Priorizar European AQI se disponível
    if (europeanAqi && europeanAqi > 0) {
        const level = AQI_LEVELS.european[Math.min(europeanAqi, 6)];
        return {
            value: europeanAqi,
            type: 'IQA Europeu',
            ...level,
            healthAdvice: getHealthAdvice(europeanAqi, 'european')
        };
    }
    
    // Usar US AQI como alternativa
    if (usAqi && usAqi > 0) {
        const aqiLevel = getUSAQILevel(usAqi);
        const level = AQI_LEVELS.us[aqiLevel];
        return {
            value: usAqi,
            type: 'IQA Americano',
            ...level,
            healthAdvice: getHealthAdvice(aqiLevel, 'us')
        };
    }
    
    // Fallback se não houver dados de IQA
    return {
        value: null,
        type: 'IQA',
        label: 'Dados Indisponíveis',
        color: '#888',
        description: 'Dados de IQA não disponíveis para esta localização'
    };
}

function getUSAQILevel(usAqi) {
    if (usAqi <= 50) return 1;
    if (usAqi <= 100) return 2;
    if (usAqi <= 150) return 3;
    if (usAqi <= 200) return 4;
    if (usAqi <= 300) return 5;
    return 6;
}

function formatPollutantData(current, units) {
    const pollutants = [
        { key: 'pm10', name: 'PM10', value: current.pm10, unit: units.pm10 || 'μg/m³' },
        { key: 'pm2_5', name: 'PM2.5', value: current.pm2_5, unit: units.pm2_5 || 'μg/m³' },
        { key: 'carbon_monoxide', name: 'CO', value: current.carbon_monoxide, unit: units.carbon_monoxide || 'μg/m³' },
        { key: 'nitrogen_dioxide', name: 'NO₂', value: current.nitrogen_dioxide, unit: units.nitrogen_dioxide || 'μg/m³' },
        { key: 'sulphur_dioxide', name: 'SO₂', value: current.sulphur_dioxide, unit: units.sulphur_dioxide || 'μg/m³' },
        { key: 'ozone', name: 'O₃', value: current.ozone, unit: units.ozone || 'μg/m³' }
    ];
    
    // Encontrar o poluente principal (maior valor relativo)
    const mainPollutant = findMainPollutant(pollutants);
    
    return pollutants
        .filter(p => p.value !== null && p.value !== undefined)
        .map(p => ({
            ...p,
            value: p.value.toFixed(1),
            isMain: p.key === mainPollutant
        }));
}

function findMainPollutant(pollutants) {
    // Valores de referência para determinar o poluente principal
    const thresholds = {
        pm10: 50,
        pm2_5: 25,
        carbon_monoxide: 10000,
        nitrogen_dioxide: 40,
        sulphur_dioxide: 20,
        ozone: 120
    };
    
    let maxRatio = 0;
    let mainPollutant = null;
    
    pollutants.forEach(p => {
        if (p.value && thresholds[p.key]) {
            const ratio = p.value / thresholds[p.key];
            if (ratio > maxRatio) {
                maxRatio = ratio;
                mainPollutant = p.key;
            }
        }
    });
    
    return mainPollutant;
}

function getHealthAdvice(level, type) {
    const adviceMap = {
        european: {
            1: 'Aproveite atividades ao ar livre!',
            2: 'Condições normais para a maioria das pessoas.',
            3: 'Pessoas sensíveis devem considerar reduzir atividades prolongadas ao ar livre.',
            4: 'Grupos sensíveis devem evitar atividades ao ar livre.',
            5: 'Todos devem evitar atividades ao ar livre.',
            6: 'Evite sair de casa. Procure atendimento médico se necessário.'
        },
        us: {
            1: 'Aproveite atividades ao ar livre!',
            2: 'Condições aceitáveis para atividades ao ar livre.',
            3: 'Grupos sensíveis devem considerar reduzir atividades prolongadas ao ar livre.',
            4: 'Todos devem reduzir atividades prolongadas ao ar livre.',
            5: 'Todos devem evitar atividades ao ar livre.',
            6: 'Permaneça em casa. Situação de emergência de saúde.'
        }
    };
    
    return adviceMap[type]?.[level] || 'Consulte autoridades locais para orientações.';
}

function handleAPIError(error) {
    let message;
    
    switch (error.message) {
        case 'LOCATION_NOT_FOUND':
            message = 'Localização não encontrada. Verifique se a cidade, estado e país estão corretos.';
            break;
        case 'GEOCODING_ERROR':
            message = 'Erro ao converter a localização em coordenadas. Verifique sua conexão com a internet.';
            break;
        case 'AIR_QUALITY_API_ERROR':
            message = 'Erro ao buscar dados de qualidade do ar. Tente novamente em alguns minutos.';
            break;
        default:
            if (error.message.includes('HTTP')) {
                message = 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.';
            } else {
                message = 'Erro inesperado. Tente novamente mais tarde.';
            }
    }
    
    showError(message);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}

function showFieldError(input, message) {
    clearFieldError(input);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    input.classList.add('error');
    input.parentNode.appendChild(errorElement);
}

function clearFieldError(input) {
    if (typeof input === 'object') {
        // Se é um elemento
        input.classList.remove('error', 'valid');
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    } else {
        // Se é um evento
        const inputElement = input.target;
        inputElement.classList.remove('error', 'valid');
        const existingError = inputElement.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

function markFieldValid(input) {
    input.classList.remove('error');
    input.classList.add('valid');
}

function markFieldError(input) {
    input.classList.remove('valid');
    input.classList.add('error');
}

function clearMessages() {
    errorMessage.style.display = 'none';
    results.style.display = 'none';
}

function setLoadingState(loading) {
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Processando...';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = '🔍 Verificar Qualidade do Ar';
    }
}

// Utilitários para debug
window.appDebug = {
    getFormData: () => getFormData(),
    validateForm: () => validateForm(),
    clearMessages: () => clearMessages()
};
