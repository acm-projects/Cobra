const { handler } = require('../lambda');
const { analyzeCodeWithOpenAI } = require('../codeAnalysis');

// Mock the analyzeCodeWithOpenAI function
jest.mock('../codeAnalysis', () => ({
    analyzeCodeWithOpenAI: jest.fn()
}));

describe('Lambda Function Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 if code is missing', async () => {
        const event = {
            body: JSON.stringify({
                problemSlug: 'two-sum'
            })
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).error).toBe('Missing required parameters: code and problemSlug');
    });

    test('should return 400 if problemSlug is missing', async () => {
        const event = {
            body: JSON.stringify({
                code: 'function test() {}'
            })
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).error).toBe('Missing required parameters: code and problemSlug');
    });

    test('should successfully analyze code', async () => {
        const mockAnalysis = 'Analysis of the code... line 5 needs attention';
        analyzeCodeWithOpenAI.mockResolvedValue(mockAnalysis);

        const event = {
            body: JSON.stringify({
                code: 'function test() {}',
                problemSlug: 'two-sum'
            })
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        
        const body = JSON.parse(response.body);
        expect(body.analysis).toBe(mockAnalysis);
        expect(body.lines).toEqual([5]);
    });

    test('should handle errors gracefully', async () => {
        analyzeCodeWithOpenAI.mockRejectedValue(new Error('API Error'));

        const event = {
            body: JSON.stringify({
                code: 'function test() {}',
                problemSlug: 'two-sum'
            })
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body).error).toBe('Internal server error');
    });
}); 