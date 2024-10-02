import mongoose from 'mongoose'

const attendanceRecordSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  attended: {
    type: Boolean,
    default: true
  },

});

const periodSchema = new mongoose.Schema({
  period: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  classType: {
    type: String,
    // enum: ['Lecture', 'Lab'], // Enum ensures only Lecture or Lab is allowed
    required: true,
  },
  hallName: {
    type: String,
    required: true,
  },
  periodId: {
    type: String,
    required: true,
    // unique: true, 
  },
  classesAttended: {
    type: Number,
    required: true,
    default: 0,
  },
  attendanceRecords: {
    type: [attendanceRecordSchema],
    // required: true,
    default: [],  
  }
});


const daySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  periods: {
    type: [periodSchema],
    required: true,
  }
});

const timetableSchema = new mongoose.Schema({
  timetableId: {
    type: String,
    unique: true,
    required: true,
  },
  schedule: {
    type: [daySchema], 
    required: true,
  }
});

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
