-- players.sql

-- Create a table for players
CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(50) NOT NULL,
    team VARCHAR(50),
    stats JSON
);

-- Insert sample data
INSERT INTO players (name, position, team, stats) VALUES
('Player 1', 'QB', 'Team A', '{"passingYards": 300, "touchdowns": 3}'),
('Player 2', 'RB', 'Team B', '{"rushingYards": 150, "touchdowns": 1}');
