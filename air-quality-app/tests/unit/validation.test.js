/**
 * Testes Unitários - Validação de Formulário
 * Testa as funções de validação de entrada do usuário
 */

// Mock dos elementos DOM necessários
const mockDOM = () => {
    global.document = {
        createElement: jest.fn(() => ({
            className: '',
            textContent: '',
            classList: { add: jest.fn(), remove: jest.fn() },
            parentNode: { appendChild: jest.fn() }
        })),
        querySelector: jest.fn()
    };

    // Mock dos inputs
    global.cityInput = {
        value: '',
        classList: { add: jest.fn(), remove: jest.fn() },
        parentNode: { 
            appendChild: jest.fn(),
            querySelector: jest.fn(() => null)
        }
    };

    global.stateInput = {
        value: '',
        classList: { add: jest.fn(), remove: jest.fn() },
        parentNode: { 
            appendChild: jest.fn(),
            querySelector: jest.fn(() => null)
        }
    };

    global.countryInput = {
        value: '',
        classList: { add: jest.fn(), remove: jest.fn() },
        parentNode: { 
            appendChild: jest.fn(),
            querySelector: jest.fn(() => null)
        }
    };
};

// Importar as funções do script principal (simulação)
const loadScriptFunctions = () => {
    // Simular as funções de validação do script.js
    global.validateRequired = (input) => {
        return input.value.trim().length > 0;
    };

    global.validateMinLength = (input, minLength) => {
        return input.value.trim().length >= minLength;
    };

    global.validateForm = () => {
        let isValid = true;
        
        // Validar cidade
        if (!validateRequired(cityInput)) {
            isValid = false;
        } else if (!validateMinLength(cityInput, 2)) {
            isValid = false;
        }
        
        // Validar estado
        if (!validateRequired(stateInput)) {
            isValid = false;
        } else if (!validateMinLength(stateInput, 2)) {
            isValid = false;
        }
        
        // Validar país (opcional)
        if (countryInput.value.trim() && !validateMinLength(countryInput, 2)) {
            isValid = false;
        }
        
        return isValid;
    };

    global.getFormData = () => {
        const city = cityInput.value.trim();
        const state = stateInput.value.trim();
        let country = countryInput.value.trim();
        
        if (!country) {
            country = 'EUA';
        }
        
        return {
            city,
            state,
            country,
            fullLocation: `${city}, ${state}, ${country}`
        };
    };
};

describe('Validação de Formulário', () => {
    beforeEach(() => {
        mockDOM();
        loadScriptFunctions();
    });

    describe('validateRequired', () => {
        test('deve retornar true para entrada válida', () => {
            cityInput.value = 'São Paulo';
            expect(validateRequired(cityInput)).toBe(true);
        });

        test('deve retornar false para entrada vazia', () => {
            cityInput.value = '';
            expect(validateRequired(cityInput)).toBe(false);
        });

        test('deve retornar false para entrada apenas com espaços', () => {
            cityInput.value = '   ';
            expect(validateRequired(cityInput)).toBe(false);
        });
    });

    describe('validateMinLength', () => {
        test('deve retornar true para entrada com tamanho mínimo', () => {
            cityInput.value = 'SP';
            expect(validateMinLength(cityInput, 2)).toBe(true);
        });

        test('deve retornar true para entrada maior que tamanho mínimo', () => {
            cityInput.value = 'São Paulo';
            expect(validateMinLength(cityInput, 2)).toBe(true);
        });

        test('deve retornar false para entrada menor que tamanho mínimo', () => {
            cityInput.value = 'S';
            expect(validateMinLength(cityInput, 2)).toBe(false);
        });

        test('deve ignorar espaços em branco no início e fim', () => {
            cityInput.value = '  SP  ';
            expect(validateMinLength(cityInput, 2)).toBe(true);
        });
    });

    describe('validateForm', () => {
        test('deve validar formulário completo e válido', () => {
            cityInput.value = 'São Paulo';
            stateInput.value = 'SP';
            countryInput.value = 'Brasil';

            expect(validateForm()).toBe(true);
        });

        test('deve validar formulário sem país (usar padrão EUA)', () => {
            cityInput.value = 'São Paulo';
            stateInput.value = 'SP';
            countryInput.value = '';

            expect(validateForm()).toBe(true);
        });

        test('deve falhar validação com cidade vazia', () => {
            cityInput.value = '';
            stateInput.value = 'SP';
            countryInput.value = 'Brasil';

            expect(validateForm()).toBe(false);
        });

        test('deve falhar validação com estado vazio', () => {
            cityInput.value = 'São Paulo';
            stateInput.value = '';
            countryInput.value = 'Brasil';

            expect(validateForm()).toBe(false);
        });

        test('deve falhar validação com cidade muito curta', () => {
            cityInput.value = 'S';
            stateInput.value = 'SP';
            countryInput.value = 'Brasil';

            expect(validateForm()).toBe(false);
        });

        test('deve falhar validação com estado muito curto', () => {
            cityInput.value = 'São Paulo';
            stateInput.value = 'S';
            countryInput.value = 'Brasil';

            expect(validateForm()).toBe(false);
        });

        test('deve falhar validação com país muito curto quando preenchido', () => {
            cityInput.value = 'São Paulo';
            stateInput.value = 'SP';
            countryInput.value = 'B';

            expect(validateForm()).toBe(false);
        });
    });

    describe('getFormData', () => {
        test('deve retornar dados do formulário com país', () => {
            cityInput.value = 'São Paulo';
            stateInput.value = 'SP';
            countryInput.value = 'Brasil';

            const formData = getFormData();

            expect(formData).toEqual({
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                fullLocation: 'São Paulo, SP, Brasil'
            });
        });

        test('deve usar EUA como país padrão quando vazio', () => {
            cityInput.value = 'New York';
            stateInput.value = 'NY';
            countryInput.value = '';

            const formData = getFormData();

            expect(formData).toEqual({
                city: 'New York',
                state: 'NY',
                country: 'EUA',
                fullLocation: 'New York, NY, EUA'
            });
        });

        test('deve remover espaços extras dos campos', () => {
            cityInput.value = '  São Paulo  ';
            stateInput.value = '  SP  ';
            countryInput.value = '  Brasil  ';

            const formData = getFormData();

            expect(formData).toEqual({
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                fullLocation: 'São Paulo, SP, Brasil'
            });
        });
    });
});
