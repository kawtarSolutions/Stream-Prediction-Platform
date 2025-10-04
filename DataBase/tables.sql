CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    code_apoge VARCHAR(50) UNIQUE NOT NULL,
    avg_api DECIMAL(4,2) CHECK (gpa >= 0 AND gpa <= 20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE streams (
    stream_id SERIAL PRIMARY KEY,
    stream_name VARCHAR(100) NOT NULL,
    stream_code VARCHAR(10) UNIQUE NOT NULL,
    total_capacity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_preferences (
    preference_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    stream_id INTEGER NOT NULL,
    preference_rank INTEGER NOT NULL CHECK (preference_rank BETWEEN 1 AND 7),
    probability_first_choice DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id) ON DELETE CASCADE,
    
    UNIQUE(student_id, preference_rank),
    UNIQUE(student_id, stream_id)
);