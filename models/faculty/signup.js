import mongoose from 'mongoose'
import { ROLES } from '../../enum/role.js'

const { Schema } = mongoose;

const facultySignupSchema = new Schema({
  facultyName: {
    type: String,
    required: true,
  },

  facultyId: {
    type: String,
    required: true,
    unique: true,
  },

  facultyEmail: {
    type: String,
    required: true,
    unique: true,
  },

  facultyPassword: {
    type: String,
    required: true,
  },

  facultyTimeTable: {
    type: Array,
  },

  role: {
    type: String,
    required: true,
    enum: [ROLES.FACULTY, ROLES.ADMIN, ROLES.GUEST],
    default: ROLES.FACULTY,
  },

});

const faculty = mongoose.model('faculty', facultySignupSchema);

export default faculty;