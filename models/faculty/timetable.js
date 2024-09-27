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
  // attendanceRecords: {
  //   type: Map,
  //   of: String, // Values will be "yes" or "no"
  //   default: {},
  //   required: true
  // }

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

// // Method to mark a class as attended or missed
// periodSchema.methods.markAttendance = function(attended, date) {
//   // Add an attendance record for the provided date
//   this.attendanceRecords.push({ date, attended });
  
//   // Update the count of attended classes
//   if (attended) {
//     this.classesAttended += 1;
//   }

//   // Increment the total classes count (since a class was either attended or missed)
//   this.totalClasses += 1;

//   return this.save(); // Save the updated document
// };

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
