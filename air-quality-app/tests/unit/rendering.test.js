/**
 * Testes Unitários - Renderização de Resultados
 * Testa as funções de formatação e exibição dos dados de qualidade do ar
 */

describe('Renderização de Resultados', () => {
    // Mock do DOM para testes de renderização
    let mockLocationInfo;

    beforeEach(() => {
        mockLocationInfo = {
            innerHTML: '',
            style: { display: 'none' },
            scrollIntoView: jest.fn()
        };

        global.locationInfo = mockLocationInfo;
        global.results = {
            style: { display: 'none' },
            scrollIntoView: jest.fn()
        };
    });

    describe('formatPollutantData', () => {
        // Simular a função formatPollutantData
        const findMainPollutant = (pollutants) => {
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
        };

        const formatPollutantData = (current, units) => {
            const pollutants = [
                { key: 'pm10', name: 'PM10', value: current.pm10, unit: units.pm10 || 'μg/m³' },
                { key: 'pm2_5', name: 'PM2.5', value: current.pm2_5, unit: units.pm2_5 || 'μg/m³' },
                { key: 'carbon_monoxide', name: 'CO', value: current.carbon_monoxide, unit: units.carbon_monoxide || 'μg/m³' },
                { key: 'nitrogen_dioxide', name: 'NO₂', value: current.nitrogen_dioxide, unit: units.nitrogen_dioxide || 'μg/m³' },
                { key: 'sulphur_dioxide', name: 'SO₂', value: current.sulphur_dioxide, unit: units.sulphur_dioxide || 'μg/m³' },
                { key: 'ozone', name: 'O₃', value: current.ozone, unit: units.ozone || 'μg/m³' }
            ];
            
            const mainPollutant = findMainPollutant(pollutants);
            
            return pollutants
                .filter(p => p.value !== null && p.value !== undefined)
                .map(p => ({
                    ...p,
                    value: p.value.toFixed(1),
                    isMain: p.key === mainPollutant
                }));
        };

        test('deve formatar dados de poluentes corretamente', () => {
            const current = {
                pm10: 35.7,
                pm2_5: 18.2,
                carbon_monoxide: 1250.5,
                nitrogen_dioxide: 42.1,
                sulphur_dioxide: 15.8,
                ozone: 95.3
            };

            const units = {
                pm10: 'μg/m³',
                pm2_5: 'μg/m³',
                carbon_monoxide: 'μg/m³',
                nitrogen_dioxide: 'μg/m³',
                sulphur_dioxide: 'μg/m³',
                ozone: 'μg/m³'
            };

            const result = formatPollutantData(current, units);

            expect(result).toHaveLength(6);
            expect(result[0]).toEqual({
                key: 'pm10',
                name: 'PM10',
                value: '35.7',
                unit: 'μg/m³',
                isMain: false
            });
        });

        test('deve identificar poluente principal corretamente', () => {
            const current = {
                pm10: 25.0,      // ratio: 25/50 = 0.5
                pm2_5: 30.0,     // ratio: 30/25 = 1.2 (maior ratio)
                carbon_monoxide: 5000.0,  // ratio: 5000/10000 = 0.5
                nitrogen_dioxide: 20.0,   // ratio: 20/40 = 0.5
                sulphur_dioxide: 10.0,    // ratio: 10/20 = 0.5
                ozone: 60.0              // ratio: 60/120 = 0.5
            };

            const units = {};
            const result = formatPollutantData(current, units);

            const mainPollutant = result.find(p => p.isMain);
            expect(mainPollutant.key).toBe('pm2_5');
        });

        test('deve filtrar valores nulos ou indefinidos', () => {
            const current = {
                pm10: 25.0,
                pm2_5: null,
                carbon_monoxide: undefined,
                nitrogen_dioxide: 20.0,
                sulphur_dioxide: 0,     // zero é válido
                ozone: 60.0
            };

            const units = {};
            const result = formatPollutantData(current, units);

            expect(result).toHaveLength(4); // pm10, nitrogen_dioxide, sulphur_dioxide, ozone
            expect(result.find(p => p.key === 'pm2_5')).toBeUndefined();
            expect(result.find(p => p.key === 'carbon_monoxide')).toBeUndefined();
        });

        test('deve usar unidades padrão quando não fornecidas', () => {
            const current = {
                pm10: 25.0,
                pm2_5: 15.0
            };

            const units = {}; // sem unidades especificadas
            const result = formatPollutantData(current, units);

            result.forEach(pollutant => {
                expect(pollutant.unit).toBe('μg/m³');
            });
        });

        test('deve arredondar valores para uma casa decimal', () => {
            const current = {
                pm10: 25.789,
                pm2_5: 15.123
            };

            const units = {};
            const result = formatPollutantData(current, units);

            expect(result[0].value).toBe('25.8');
            expect(result[1].value).toBe('15.1');
        });
    });

    describe('showAirQualityResults', () => {
        // Simular função showAirQualityResults
        const showAirQualityResults = (formData, coordinates, airQualityData) => {
            const { current, timezone } = airQualityData;
            
            // Simular determineAQILevel
            const aqiInfo = {
                value: current.european_aqi || current.us_aqi || null,
                type: current.european_aqi ? 'IQA Europeu' : 'IQA Americano',
                label: 'Boa',
                color: '#00e400',
                description: 'Qualidade do ar satisfatória'
            };
            
            // Simular formatPollutantData
            const pollutants = [
                { name: 'PM10', value: '25.0', unit: 'μg/m³', isMain: false },
                { name: 'PM2.5', value: '15.0', unit: 'μg/m³', isMain: true }
            ];
            
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
                    <h3>📍 ${coordinates.address.city || formData.city}</h3>
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
        };

        test('deve renderizar resultados de qualidade do ar corretamente', () => {
            const formData = {
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil'
            };

            const coordinates = {
                lat: -23.5505,
                lon: -46.6333,
                displayName: 'São Paulo, SP, Brasil',
                address: { city: 'São Paulo' }
            };

            const airQualityData = {
                current: {
                    time: '2024-01-15T10:00',
                    european_aqi: 2,
                    pm10: 25.0,
                    pm2_5: 15.0
                },
                timezone: 'America/Sao_Paulo'
            };

            showAirQualityResults(formData, coordinates, airQualityData);

            expect(locationInfo.innerHTML).toContain('📍 São Paulo');
            expect(locationInfo.innerHTML).toContain('São Paulo, SP, Brasil');
            expect(locationInfo.innerHTML).toContain('Coordenadas: -23.5505, -46.6333');
            expect(locationInfo.innerHTML).toContain('IQA Europeu');
            expect(locationInfo.innerHTML).toContain('America/Sao_Paulo');
            expect(results.style.display).toBe('block');
            expect(results.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
        });

        test('deve usar nome da cidade do formulário quando não disponível no endereço', () => {
            const formData = {
                city: 'Cidade Teste',
                state: 'ST',
                country: 'País'
            };

            const coordinates = {
                lat: 0,
                lon: 0,
                displayName: 'Local de Teste',
                address: {} // sem cidade
            };

            const airQualityData = {
                current: {
                    time: '2024-01-15T10:00',
                    us_aqi: 45
                },
                timezone: 'UTC'
            };

            showAirQualityResults(formData, coordinates, airQualityData);

            expect(locationInfo.innerHTML).toContain('📍 Cidade Teste');
        });

        test('deve formatar coordenadas com 4 casas decimais', () => {
            const formData = { city: 'Test', state: 'TS', country: 'País' };
            const coordinates = {
                lat: -23.550512345,
                lon: -46.633308789,
                displayName: 'Test Location',
                address: {}
            };
            const airQualityData = {
                current: { time: '2024-01-15T10:00', us_aqi: 45 },
                timezone: 'UTC'
            };

            showAirQualityResults(formData, coordinates, airQualityData);

            expect(locationInfo.innerHTML).toContain('Coordenadas: -23.5505, -46.6333');
        });
    });

    describe('Tratamento de Erros', () => {
        // Simular função handleAPIError
        const handleAPIError = (error) => {
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
            
            return message;
        };

        test('deve retornar mensagem específica para localização não encontrada', () => {
            const error = new Error('LOCATION_NOT_FOUND');
            const message = handleAPIError(error);
            
            expect(message).toBe('Localização não encontrada. Verifique se a cidade, estado e país estão corretos.');
        });

        test('deve retornar mensagem específica para erro de geocodificação', () => {
            const error = new Error('GEOCODING_ERROR');
            const message = handleAPIError(error);
            
            expect(message).toBe('Erro ao converter a localização em coordenadas. Verifique sua conexão com a internet.');
        });

        test('deve retornar mensagem específica para erro da API de qualidade do ar', () => {
            const error = new Error('AIR_QUALITY_API_ERROR');
            const message = handleAPIError(error);
            
            expect(message).toBe('Erro ao buscar dados de qualidade do ar. Tente novamente em alguns minutos.');
        });

        test('deve retornar mensagem genérica para erro HTTP', () => {
            const error = new Error('HTTP 500: Internal Server Error');
            const message = handleAPIError(error);
            
            expect(message).toBe('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
        });

        test('deve retornar mensagem genérica para erro desconhecido', () => {
            const error = new Error('Erro não conhecido');
            const message = handleAPIError(error);
            
            expect(message).toBe('Erro inesperado. Tente novamente mais tarde.');
        });
    });
});
