const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  subjectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'subjects',
      key: 'id',
    },
  },
  classId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id',
    },
  },
  examType: {
    type: DataTypes.ENUM('assignment', 'quiz', 'midterm', 'final', 'project', 'homework', 'participation'),
    allowNull: false,
  },
  examName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  maxMarks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  obtainedMarks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  grade: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  gpa: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
  },
  examDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  term: {
    type: DataTypes.ENUM('1st', '2nd', '3rd', 'annual'),
    allowNull: false,
  },
  academicYear: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  weight: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 1.0,
  },
}, {
  hooks: {
    beforeSave: (grade) => {
      if (grade.maxMarks && grade.obtainedMarks) {
        grade.percentage = (grade.obtainedMarks / grade.maxMarks) * 100;
        
        // Calculate grade based on percentage
        if (grade.percentage >= 90) grade.grade = 'A+';
        else if (grade.percentage >= 80) grade.grade = 'A';
        else if (grade.percentage >= 70) grade.grade = 'B+';
        else if (grade.percentage >= 60) grade.grade = 'B';
        else if (grade.percentage >= 50) grade.grade = 'C+';
        else if (grade.percentage >= 40) grade.grade = 'C';
        else if (grade.percentage >= 35) grade.grade = 'D';
        else grade.grade = 'F';
        
        // Calculate GPA
        if (grade.percentage >= 90) grade.gpa = 4.0;
        else if (grade.percentage >= 80) grade.gpa = 3.5;
        else if (grade.percentage >= 70) grade.gpa = 3.0;
        else if (grade.percentage >= 60) grade.gpa = 2.5;
        else if (grade.percentage >= 50) grade.gpa = 2.0;
        else if (grade.percentage >= 40) grade.gpa = 1.5;
        else if (grade.percentage >= 35) grade.gpa = 1.0;
        else grade.gpa = 0.0;
      }
    },
  },
  indexes: [
    {
      fields: ['student_id', 'subject_id', 'exam_type', 'term', 'academic_year'],
    },
    {
      fields: ['class_id'],
    },
    {
      fields: ['exam_date'],
    },
    {
      fields: ['academic_year'],
    },
  ],
});

module.exports = Grade;