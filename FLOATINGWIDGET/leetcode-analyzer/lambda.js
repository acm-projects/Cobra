const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function analyzeCodeWithOpenAI(code, problemSlug) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a code analysis assistant. Your only job is to check for simple syntax and logic errors. You are not having a conversation with the user. Your role is the same as a spellchecker. Do NOT analyze the code as a whole, only scan it for simple typos. Return a short sentence of the suggested error fix. DO NOT RETURN CODE. DO NOT RETURN OPTIMIZATION OR PERFORMANCE SUGGESTIONS. DO NOT RETURN MORE THAN 2 SENTENCES PER ERROR. You are forbidden from addressing optimization, input validation, or any other optional improvemnts if the code runs. If the logic and syntax are correct, DO NOT GIVE OPTIMIZATION SUGGESTIONS. DO NOT GIVE PERFORMACE SUGGESTIONS. DO NOT GIVE BEST PRACTICES SUGGESTIONS. ONLY ADDRESS LOGIC, SYNTAX, AND TYPOS."
                    //"You are a code analysis assistant. Analyze the provided code for simple syntax errors and simple logical errors. Return ."
                },
                {
                    role: "user",
                    content: ` ${problemSlug}:\n\n${code}`
                }
            ],
            temperature: 0.3
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing code with OpenAI:', error);
        throw error;
    }
}

function extractLinesFromAnalysis(analysis) {
    const lineRegex = /line (\d+)/gi;
    const lines = new Set();
    let match;
    
    while ((match = lineRegex.exec(analysis)) !== null) {
        lines.add(parseInt(match[1]));
    }
    
    return Array.from(lines);
}

module.exports.handler = async (event) => {
    try {
        // Parse the incoming request
        const { code, problemSlug } = JSON.parse(event.body);

        if (!code || !problemSlug) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({
                    error: 'Missing required parameters: code and problemSlug'
                })
            };
        }

        // Analyze the code
        const analysis = await analyzeCodeWithOpenAI(code, problemSlug);
        
        // Return the analysis results
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                analysis,
                lines: extractLinesFromAnalysis(analysis)
            })
        };
    } catch (error) {
        console.error('Error in Lambda function:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
}; 