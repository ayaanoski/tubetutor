-- TubeTutor MindsDB Setup Script (Fixed Version)
-- This script sets up the knowledge base and AI components for semantic video search

-- 1. Create Knowledge Base for Educational Videos
CREATE KNOWLEDGE_BASE IF NOT EXISTS eduvideos_kb
USING
  engine = 'chromadb',
  metadata_columns = ['video_id', 'channel_name', 'topic', 'difficulty_level', 'duration', 'language', 'view_count', 'start_time'];

-- 2. Create AI Model for content analysis (simplified)
CREATE MODEL IF NOT EXISTS eduvideos_analyzer
PREDICT analysis
USING
  engine = 'openai',
  model_name = 'gpt-3.5-turbo',
  prompt_template = 'Analyze this educational content and provide topic and difficulty: {{content}}';

-- 3. Check available skills before creating agent
SHOW SKILLS;

-- 4. Create Agent (Basic version without knowledge_base skill)
CREATE AGENT IF NOT EXISTS tubetutor_agent
USING
  model = 'gpt-3.5-turbo',
  description = 'TubeTutor AI assistant that helps users find educational video content',
  instructions = 'You are a helpful assistant specializing in educational content. Help users find relevant video segments for learning programming, mathematics, science, and other subjects.';

-- 5. Sample data insertion (for testing)
INSERT INTO eduvideos_kb (content, metadata)
VALUES 
(
    'Recursion is a programming technique where a function calls itself. When working with tree data structures, recursion is particularly powerful because trees have a recursive nature - each subtree is itself a tree.',
    JSON_OBJECT(
        'video_id', 'sample_recursion_1',
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
        'video_id', 'sample_trees_1', 
        'start_time', 300,
        'channel_name', 'CS Fundamentals',
        'topic', 'programming',
        'difficulty_level', 'beginner',
        'duration', '32:15',
        'language', 'english',
        'view_count', '856000'
    )
),
(
    'JavaScript promises provide a way to handle asynchronous operations. A promise represents a value that may not be available yet but will be resolved at some point in the future.',
    JSON_OBJECT(
        'video_id', 'sample_promises_1',
        'start_time', 180,
        'channel_name', 'JavaScript Mastery',
        'topic', 'programming',
        'difficulty_level', 'intermediate',
        'duration', '28:45',
        'language', 'english',
        'view_count', '2100000'
    )
);

-- 6. Test the setup
SELECT COUNT(*) as total_documents FROM eduvideos_kb;

-- 7. Test search functionality
SELECT content, metadata 
FROM eduvideos_kb 
WHERE content LIKE '%recursion%' 
LIMIT 3;
