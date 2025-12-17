-- =====================================================
-- SCRIPT MYSQL COMPLET - GESTION SCOLAIRE
-- =====================================================
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- ROLES
-- =====================================================
CREATE TABLE roles (
    roleID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- USER_ROLES
-- =====================================================
CREATE TABLE user_roles (
    userID INT,
    roleID INT,
    PRIMARY KEY (userID, roleID),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (roleID) REFERENCES roles(roleID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- STUDENTS
-- =====================================================
CREATE TABLE students (
    userID INT PRIMARY KEY,
    matricule VARCHAR(50) UNIQUE,
    birthdate DATE,
    gender ENUM('MALE','FEMALE') DEFAULT 'MALE',
    phone VARCHAR(20),
    address VARCHAR(255),
    picture VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TEACHERS
-- =====================================================
CREATE TABLE teachers (
    userID INT PRIMARY KEY,
    grade VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    picture VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- FILIERES
-- =====================================================
CREATE TABLE filieres (
    filiereID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ACADEMIC YEARS
-- =====================================================
CREATE TABLE academic_years (
    academicYearID INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(20) NOT NULL UNIQUE,
    startDate DATE,
    endDate DATE,
    isActive BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PERIODS
-- =====================================================
CREATE TABLE periods (
    periodID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    academicYearID INT NOT NULL,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (academicYearID) REFERENCES academic_years(academicYearID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- CLASSES
-- =====================================================
CREATE TABLE classes (
    classID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50),
    filiereID INT,
    academicYearID INT,
    FOREIGN KEY (filiereID) REFERENCES filieres(filiereID),
    FOREIGN KEY (academicYearID) REFERENCES academic_years(academicYearID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ENROLLMENTS
-- =====================================================
CREATE TABLE enrollments (
    studentID INT,
    classID INT,
    enrollmentDate DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (studentID, classID),
    FOREIGN KEY (studentID) REFERENCES students(userID) ON DELETE CASCADE,
    FOREIGN KEY (classID) REFERENCES classes(classID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SUBJECTS
-- =====================================================
CREATE TABLE subjects (
    subjectID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coefficient INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- CLASS_SUBJECTS
-- =====================================================
CREATE TABLE class_subjects (
    classSubjectID INT AUTO_INCREMENT PRIMARY KEY,
    classID INT NOT NULL,
    subjectID INT NOT NULL,
    teacherID INT NOT NULL,
    UNIQUE (classID, subjectID),
    FOREIGN KEY (classID) REFERENCES classes(classID) ON DELETE CASCADE,
    FOREIGN KEY (subjectID) REFERENCES subjects(subjectID),
    FOREIGN KEY (teacherID) REFERENCES teachers(userID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SESSIONS
-- =====================================================
CREATE TABLE sessions (
    sessionID INT AUTO_INCREMENT PRIMARY KEY,
    classSubjectID INT NOT NULL,
    teacherID INT NOT NULL,
    sessionDate DATE NOT NULL,
    startTime TIME,
    endTime TIME,
    FOREIGN KEY (classSubjectID) REFERENCES class_subjects(classSubjectID) ON DELETE CASCADE,
    FOREIGN KEY (teacherID) REFERENCES teachers(userID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ATTENDANCES
-- =====================================================
CREATE TABLE attendances (
    attendanceID INT AUTO_INCREMENT PRIMARY KEY,
    sessionID INT,
    studentID INT,
    status ENUM('PRESENT','ABSENT','RETARD','JUSTIFIE') DEFAULT 'ABSENT',
    comment VARCHAR(255),
    UNIQUE (sessionID, studentID),
    FOREIGN KEY (sessionID) REFERENCES sessions(sessionID) ON DELETE CASCADE,
    FOREIGN KEY (studentID) REFERENCES students(userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- EVALUATIONS
-- =====================================================
CREATE TABLE evaluations (
    evaluationID INT AUTO_INCREMENT PRIMARY KEY,
    classSubjectID INT NOT NULL,
    teacherID INT NOT NULL,
    periodID INT NOT NULL,
    type ENUM('DEVOIR','CONTROLE','EXAMEN') NOT NULL,
    coefficient INT DEFAULT 1,
    max_score DECIMAL(5,2) DEFAULT 20,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (classSubjectID, teacherID, periodID),
    FOREIGN KEY (classSubjectID) REFERENCES class_subjects(classSubjectID) ON DELETE CASCADE,
    FOREIGN KEY (teacherID) REFERENCES teachers(userID),
    FOREIGN KEY (periodID) REFERENCES periods(periodID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- GRADES
-- =====================================================
CREATE TABLE grades (
    gradeID INT AUTO_INCREMENT PRIMARY KEY,
    evaluationID INT NOT NULL,
    studentID INT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL,
    UNIQUE (evaluationID, studentID),
    FOREIGN KEY (evaluationID) REFERENCES evaluations(evaluationID) ON DELETE CASCADE,
    FOREIGN KEY (studentID) REFERENCES students(userID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- REPORT CARDS
-- =====================================================
CREATE TABLE report_cards (
    reportCardID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT NOT NULL,
    classID INT NOT NULL,
    periodID INT NOT NULL,
    average DECIMAL(5,2),
    rank INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (studentID, classID, periodID),
    FOREIGN KEY (studentID) REFERENCES students(userID),
    FOREIGN KEY (classID) REFERENCES classes(classID),
    FOREIGN KEY (periodID) REFERENCES periods(periodID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- AUDIT LOGS
-- =====================================================
CREATE TABLE audit_logs (
    auditLogID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100),
    entityID INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
