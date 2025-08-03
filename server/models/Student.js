const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  admissionNumber: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  admissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  classId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'classes',
      key: 'id',
    },
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  rollNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  guardianName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  guardianRelation: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  guardianPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  guardianEmail: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  emergencyContactName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  emergencyContactPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  emergencyContactRelation: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  bloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    allowNull: true,
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  medicalConditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  previousSchool: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  transferCertificate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'transferred', 'graduated', 'expelled'),
    defaultValue: 'active',
  },
  dateOfLeaving: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  reasonForLeaving: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  religion: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  caste: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fatherName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fatherOccupation: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fatherPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  motherName: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  motherOccupation: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  motherPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  hostelResident: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  transportRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  routeId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'transport_routes',
      key: 'id',
    },
  },
}, {
  indexes: [
    {
      fields: ['student_id'],
      unique: true,
    },
    {
      fields: ['admission_number'],
      unique: true,
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['class_id'],
    },
    {
      fields: ['status'],
    },
  ],
});

module.exports = Student;