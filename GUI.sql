-- 1. Create Knowledge Base (YouTube transcripts)
CREATE DATABASE tubetutor_kb
WITH ENGINE = "files",
PARAMETERS = {
    "path": "/mnt/data/tubetutor_transcripts.csv",
    "format": "csv",
    "header": true
};

-- 2. Optional: Preview Knowledge Base
SELECT * FROM tubetutor_kb.transcripts LIMIT 5;

-- 3. Create ML Model (predicting 'answer' from 'question')
CREATE MODEL mindsdb.tubetutor_model
PREDICT answer
USING
    engine = 'lightwood',
    from_table = 'tubetutor_kb.transcripts',
    input_columns = ['question'],
    output_column = 'answer';

-- 4. Create AI Agent using OpenAI
CREATE AGENT tubetutor_agent
FROM mindsdb
USING {
    "engine": "openai",
    "api_key": "YOUR_OPENAI_API_KEY",
    "model": "gpt-4",
    "knowledge_base": "tubetutor_kb"
};

-- 5. Query the model directly
SELECT answer
FROM mindsdb.tubetutor_model
WHERE question = "What is Ohm's Law?";

-- 6. Query the AI Agent
SELECT response
FROM mindsdb.tubetutor_agent
WHERE query = "Explain a capacitor in simple terms.";

-- 7. Create a scheduled JOB to run a query every 24 hours
CREATE JOB tubetutor_daily_summary
AS (
    SELECT response
    FROM mindsdb.tubetutor_agent
    WHERE query = "Summarize today’s electrical engineering tutorial."
)
EVERY 1 DAY
START NOW;

-- 8. Check job list
SHOW JOBS;

-- 9. Drop the job (if needed)
DROP JOB tubetutor_daily_summary;
