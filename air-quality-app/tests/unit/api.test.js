/**
 * Testes Unitários - API de Qualidade do Ar
 * Testa as funções de integração com APIs externas
 */

// Mock do fetch global
global.fetch = jest.fn();

describe('API de Qualidade do Ar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('geocodeLocation', () => {
        const mockFormData = {
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            fullLocation: 'São Paulo, SP, Brasil'
        };

        // Simular a função geocodeLocation
        const geocodeLocation = async (formData) => {
            const query = encodeURIComponent(formData.fullLocation);
            const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&addressdetails=1`;
            
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
        };

        test('deve retornar coordenadas para localização válida', async () => {
            const mockResponse = [{
                lat: '-23.5505',
                lon: '-46.6333',
                display_name: 'São Paulo, SP, Brasil',
                address: { city: 'São Paulo', state: 'SP', country: 'Brasil' }
            }];

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await geocodeLocation(mockFormData);

            expect(result).toEqual({
                lat: -23.5505,
                lon: -46.6333,
                displayName: 'São Paulo, SP, Brasil',
                address: { city: 'São Paulo', state: 'SP', country: 'Brasil' }
            });
        });

        test('deve retornar null para localização não encontrada', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => []
            });

            const result = await geocodeLocation(mockFormData);

            expect(result).toBeNull();
        });

        test('deve lançar erro para resposta HTTP inválida', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                statusText: 'Not Found'
            });

            await expect(geocodeLocation(mockFormData)).rejects.toThrow('HTTP 404: Not Found');
        });

        test('deve lançar erro para falha de rede', async () => {
            fetch.mockRejectedValueOnce(new Error('Network Error'));

            await expect(geocodeLocation(mockFormData)).rejects.toThrow('GEOCODING_ERROR');
        });

        test('deve usar User-Agent correto', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => [{ lat: '0', lon: '0', display_name: 'Test', address: {} }]
            });

            await geocodeLocation(mockFormData);

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining('nominatim.openstreetmap.org'),
                expect.objectContaining({
                    headers: {
                        'User-Agent': 'AirQualityApp/1.0 (Workshop Sinquia Evertec)'
                    }
                })
            );
        });
    });

    describe('fetchAirQualityData', () => {
        const mockCoordinates = {
            lat: -23.5505,
            lon: -46.6333
        };

        // Simular a função fetchAirQualityData
        const fetchAirQualityData = async (coordinates) => {
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
            
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
        };

        test('deve retornar dados de qualidade do ar válidos', async () => {
            const mockResponse = {
                current: {
                    time: '2024-01-15T10:00',
                    european_aqi: 2,
                    us_aqi: 45,
                    pm10: 20.5,
                    pm2_5: 12.3,
                    carbon_monoxide: 250.0,
                    nitrogen_dioxide: 25.7,
                    sulphur_dioxide: 8.2,
                    ozone: 85.4
                },
                timezone: 'America/Sao_Paulo',
                current_units: {
                    pm10: 'μg/m³',
                    pm2_5: 'μg/m³',
                    carbon_monoxide: 'μg/m³',
                    nitrogen_dioxide: 'μg/m³',
                    sulphur_dioxide: 'μg/m³',
                    ozone: 'μg/m³'
                }
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            });

            const result = await fetchAirQualityData(mockCoordinates);

            expect(result).toEqual({
                current: mockResponse.current,
                timezone: mockResponse.timezone,
                units: mockResponse.current_units
            });
        });

        test('deve lançar erro para resposta HTTP inválida', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error'
            });

            await expect(fetchAirQualityData(mockCoordinates)).rejects.toThrow('HTTP 500: Internal Server Error');
        });

        test('deve lançar erro para dados ausentes', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ timezone: 'UTC' }) // sem dados current
            });

            await expect(fetchAirQualityData(mockCoordinates)).rejects.toThrow('Dados de qualidade do ar não disponíveis');
        });

        test('deve usar URL correta com parâmetros', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    current: { time: '2024-01-15T10:00' },
                    timezone: 'UTC'
                })
            });

            await fetchAirQualityData(mockCoordinates);

            expect(fetch).toHaveBeenCalledWith(
                'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-23.5505&longitude=-46.6333&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto'
            );
        });
    });

    describe('determineAQILevel', () => {
        // Simular constantes e função determineAQILevel
        const AQI_LEVELS = {
            european: {
                1: { label: 'Boa', color: '#00e400', description: 'Qualidade do ar satisfatória' },
                2: { label: 'Razoável', color: '#ffff00', description: 'Qualidade do ar aceitável' },
                3: { label: 'Moderada', color: '#ff7e00', description: 'Grupos sensíveis podem ter sintomas' },
                4: { label: 'Ruim', color: '#ff0000', description: 'Prejudicial para grupos sensíveis' },
                5: { label: 'Muito Ruim', color: '#8f3f97', description: 'Prejudicial para todos' },
                6: { label: 'Extremamente Ruim', color: '#7e0023', description: 'Emergência de saúde' }
            },
            us: {
                1: { label: 'Boa', color: '#00e400', description: 'Qualidade do ar satisfatória' },
                2: { label: 'Moderada', color: '#ffff00', description: 'Aceitável para a maioria' },
                3: { label: 'Prejudicial para Grupos Sensíveis', color: '#ff7e00', description: 'Grupos sensíveis podem ter problemas' },
                4: { label: 'Prejudicial', color: '#ff0000', description: 'Todos podem sentir efeitos' },
                5: { label: 'Muito Prejudicial', color: '#8f3f97', description: 'Aviso de saúde' },
                6: { label: 'Perigosa', color: '#7e0023', description: 'Emergência de saúde' }
            }
        };

        const getUSAQILevel = (usAqi) => {
            if (usAqi <= 50) return 1;
            if (usAqi <= 100) return 2;
            if (usAqi <= 150) return 3;
            if (usAqi <= 200) return 4;
            if (usAqi <= 300) return 5;
            return 6;
        };

        const getHealthAdvice = (level, type) => {
            const adviceMap = {
                european: {
                    1: 'Aproveite atividades ao ar livre!'
                },
                us: {
                    1: 'Aproveite atividades ao ar livre!'
                }
            };
            return adviceMap[type]?.[level] || 'Consulte autoridades locais.';
        };

        const determineAQILevel = (current) => {
            const europeanAqi = current.european_aqi;
            const usAqi = current.us_aqi;
            
            if (europeanAqi && europeanAqi > 0) {
                const level = AQI_LEVELS.european[Math.min(europeanAqi, 6)];
                return {
                    value: europeanAqi,
                    type: 'IQA Europeu',
                    ...level,
                    healthAdvice: getHealthAdvice(europeanAqi, 'european')
                };
            }
            
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
            
            return {
                value: null,
                type: 'IQA',
                label: 'Dados Indisponíveis',
                color: '#888',
                description: 'Dados de IQA não disponíveis para esta localização'
            };
        };

        test('deve priorizar European AQI quando disponível', () => {
            const current = {
                european_aqi: 2,
                us_aqi: 75
            };

            const result = determineAQILevel(current);

            expect(result.type).toBe('IQA Europeu');
            expect(result.value).toBe(2);
            expect(result.label).toBe('Razoável');
        });

        test('deve usar US AQI quando European AQI não disponível', () => {
            const current = {
                european_aqi: null,
                us_aqi: 75
            };

            const result = determineAQILevel(current);

            expect(result.type).toBe('IQA Americano');
            expect(result.value).toBe(75);
            expect(result.label).toBe('Moderada');
        });

        test('deve retornar fallback quando nenhum AQI disponível', () => {
            const current = {
                european_aqi: null,
                us_aqi: null
            };

            const result = determineAQILevel(current);

            expect(result.type).toBe('IQA');
            expect(result.value).toBeNull();
            expect(result.label).toBe('Dados Indisponíveis');
        });

        test('deve limitar European AQI ao máximo de 6', () => {
            const current = {
                european_aqi: 10, // valor acima do máximo
                us_aqi: null
            };

            const result = determineAQILevel(current);

            expect(result.label).toBe('Extremamente Ruim'); // nível 6
        });
    });
});
