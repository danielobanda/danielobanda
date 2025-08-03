const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  classTeacherId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 40,
  },
  room: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  academicYear: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  indexes: [
    {
      fields: ['name', 'section', 'academic_year'],
      unique: true,
    },
    {
      fields: ['grade'],
    },
    {
      fields: ['class_teacher_id'],
    },
  ],
});

module.exports = Class;