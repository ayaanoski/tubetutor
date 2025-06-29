-- TubeTutor MindsDB Setup Script
-- This script sets up the knowledge base and AI components for semantic video search

-- 1. Create Knowledge Base for Educational Videos
CREATE KNOWLEDGE_BASE eduvideos_kb
USING ChromaDB
WITH
  metadata_columns = ['video_id', 'channel_name', 'topic', 'difficulty_level', 'duration', 'language', 'view_count'];

-- 2. Create index for better search performance
CREATE INDEX ON KNOWLEDGE_BASE eduvideos_kb;

-- 3. Create AI Table for summarizing search results
CREATE AI TABLE video_summarizer (
    query TEXT,
    top_results TEXT,
    summary TEXT
)
USING openai
WITH
  model = 'gpt-4',
  prompt_template = 'Given this search query: "{{query}}" and these video transcript results: {{top_results}}, provide a concise summary of the key learning points and recommend which video segment would be most helpful.';

-- 4. Create Agent for conversational queries
CREATE AGENT tubetutor_agent
USING openai
WITH
  model = 'gpt-4',
  system_prompt = 'You are TubeTutor AI, an educational video search assistant. Help users find the best video segments for their learning needs. Always provide specific timestamps and explain why each recommendation is relevant.',
  knowledge_base = 'eduvideos_kb';

-- 5. Create Job to periodically update knowledge base
CREATE JOB update_video_kb
AS (
    -- This would typically fetch new videos and update the knowledge base
    SELECT 'Knowledge base update completed' as status
)
EVERY hour;

-- 6. Sample data insertion (for testing)
INSERT INTO eduvideos_kb (content, metadata)
VALUES 
(
    'Recursion is a programming technique where a function calls itself. When working with tree data structures, recursion is particularly powerful because trees have a recursive nature - each subtree is itself a tree.',
    JSON_OBJECT(
        'video_id', 'sample_video_1',
        'start_time', 120,
        'channel_name', 'CodeAcademy Pro',
        'topic', 'programming',
        'difficulty_level', 'intermediate',
        'duration', '45:32',
        'language', 'english',
        'view_count', '1200000'
    )
),
(
    'Binary trees are hierarchical data structures where each node has at most two children. Tree traversal algorithms like inorder, preorder, and postorder are naturally implemented using recursion.',
    JSON_OBJECT(
        'video_id', 'sample_video_2', 
        'start_time', 300,
        'channel_name', 'CS Fundamentals',
        'topic', 'programming',
        'difficulty_level', 'beginner',
        'duration', '32:15',
        'language', 'english',
        'view_count', '856000'
    )
);

-- 7. Evaluate knowledge base performance
EVALUATE KNOWLEDGE_BASE eduvideos_kb
WITH 
  test_queries = [
    'explain recursion with trees',
    'binary tree traversal',
    'recursive algorithms'
  ];
