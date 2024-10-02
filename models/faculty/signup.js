import mongoose from 'mongoose'
import { ROLES } from '../../enum/role.js'

const { Schema } = mongoose;

const facultySignupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  id: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  timetableId: {
    // type: Array,
    type: String
  },

  role: {
    type: String,
    required: true,
    enum: [ROLES.FACULTY, ROLES.ADMIN, ROLES.GUEST],
    default: ROLES.FACULTY,
  },

  isVerified:{
    type: Boolean,
    default: false
  }

});

const faculty = mongoose.model('faculty', facultySignupSchema);

export default faculty;