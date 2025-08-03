const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Student = require('./Student');
const Class = require('./Class');
const Subject = require('./Subject');
const Attendance = require('./Attendance');
const Grade = require('./Grade');

// Define associations
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

User.hasMany(Class, { foreignKey: 'classTeacherId', as: 'classesAsTeacher' });
Class.belongsTo(User, { foreignKey: 'classTeacherId', as: 'classTeacher' });

Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Class.hasMany(Attendance, { foreignKey: 'classId', as: 'attendances' });
Attendance.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

Subject.hasMany(Attendance, { foreignKey: 'subjectId', as: 'attendances' });
Attendance.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

User.hasMany(Attendance, { foreignKey: 'markedBy', as: 'markedAttendances' });
Attendance.belongsTo(User, { foreignKey: 'markedBy', as: 'markedByUser' });

Student.hasMany(Grade, { foreignKey: 'studentId', as: 'grades' });
Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Subject.hasMany(Grade, { foreignKey: 'subjectId', as: 'grades' });
Grade.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

Class.hasMany(Grade, { foreignKey: 'classId', as: 'grades' });
Grade.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

User.hasMany(Grade, { foreignKey: 'teacherId', as: 'gradedAssessments' });
Grade.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

// Many-to-many associations
const ClassSubject = sequelize.define('ClassSubject', {
  id: {
    type: sequelize.Sequelize.UUID,
    defaultValue: sequelize.Sequelize.UUIDV4,
    primaryKey: true,
  },
  classId: {
    type: sequelize.Sequelize.UUID,
    references: {
      model: Class,
      key: 'id',
    },
  },
  subjectId: {
    type: sequelize.Sequelize.UUID,
    references: {
      model: Subject,
      key: 'id',
    },
  },
  teacherId: {
    type: sequelize.Sequelize.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  academicYear: {
    type: sequelize.Sequelize.STRING(10),
    allowNull: false,
  },
});

Class.belongsToMany(Subject, { 
  through: ClassSubject, 
  foreignKey: 'classId',
  as: 'subjects'
});
Subject.belongsToMany(Class, { 
  through: ClassSubject, 
  foreignKey: 'subjectId',
  as: 'classes'
});

User.belongsToMany(Subject, {
  through: ClassSubject,
  foreignKey: 'teacherId',
  as: 'teachingSubjects'
});

User.belongsToMany(Class, {
  through: ClassSubject,
  foreignKey: 'teacherId',
  as: 'teachingClasses'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Student,
  Class,
  Subject,
  Attendance,
  Grade,
  ClassSubject,
};