import faculty from '../models/faculty/signup.js';
import jwt from 'jsonwebtoken'
import Timetable from '../models/faculty/timetable.js';
import moment from 'moment'
import mongoose from 'mongoose';
export const getFacultyId = (req) => {
  const encodedToken = req.cookies?.facultyToken
  if (!encodedToken) return null

  const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET)
  return decodedToken?.id
}

// Helper function to get timetable
export const getTimetable = async (req) => {
  const facultyData = await faculty.findOne({ _id: getFacultyId(req) });
  if (!facultyData || !facultyData.timetableId) {
    throw new Error("Failed to fetch the Timetable ID for the faculty.");
  }

  const timetable = await Timetable.findOne({ timetableId: facultyData.timetableId });
  if (!timetable) {
    throw new Error("Timetable not found.");
  }

  return timetable;
};

function getDateOfWeek(dayOfWeek) {
  return moment().day(dayOfWeek).format('DD/MM/YYYY');
}

export async function setTimeTable(req, res) {

  try {
    const { timetableId, schedule } = req.body;
    const setTTId = await faculty.findOneAndUpdate({ _id: getFacultyId(req) }, { $set: { timetableId: timetableId } })
    if (!setTTId) {
      return res.status(500).json({
        success: false,
        message: "Time Table ID is not submitted to Faculty",
      })
    }

    const timetable = new Timetable({
      timetableId,
      schedule,
    });

    await timetable.save();
    return res.status(201).json({
      success: true,
      message: 'Timetable uploaded successfully!',
    });
  } catch (error) {
    console.error("Error saving timetable:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload timetable',
      error: error.message,
    });
  }
}

export async function getUserName(req, res) {
  const { name } = await faculty.findOne({ _id: getFacultyId(req) })

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "User's Name retrieve failed"
    });
  }

  return res.status(200).json({
    success: true,
    message: "User's name retrieve successfully",
    userData: name
  })
}

export async function getSchedule(req, res) {
  try {
    const timetable = await getTimetable(req);
    return res.status(200).json({
      success: true,
      message: "Successfully fetched the schedule",
      data: timetable,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateAttendence (req, res){
  const { periodId, date, status } = req.body;

  try {
    const timetable = await Timetable.findOne({
      "schedule.periods.periodId": periodId,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Period not found in the timetable.",
      });
    }

    const day = timetable.schedule.find((daySchedule) =>
      daySchedule.periods.some((period) => period.periodId === periodId)
    );

    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found in the timetable.",
      });
    }

    const period = day.periods.find((p) => p.periodId === periodId);
    if (!period) {
      return res.status(404).json({
        success: false,
        message: "Period not found.",
      });
    }

    const existingRecord = period.attendanceRecords.find(record => record.date === date);
    if (existingRecord) {
      console.log(existingRecord, "exit")
      console.log(status, "status")
      existingRecord.attended = (status=="no") ? false : true
    } else {
      console.log("Called")
      period.attendanceRecords.push({ date , attended:(status=="no") ? false : true});
    }
    console.log(existingRecord, "$$$$$$$$$$")
    timetable.markModified("schedule");

    const tt=await timetable.save();
    res.status(200).json({
      success: true,
      message: "Attendance updated successfully.",
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update attendance.",
    });
  }
};

export async function setDefaultAttendence(req, res){
  try {
    const timetable = await getTimetable(req);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    timetable.schedule.forEach((daySchedule) => {
      if (daysOfWeek.includes(daySchedule.day)) {
        const date = getDateOfWeek(daySchedule.day);
        
        daySchedule.periods.forEach(period => {
          const existingRecord = period.attendanceRecords.find(record => record.date === date);
          if (!existingRecord) {
            console.log("Not")
            period.attendanceRecords.push({ date, attended: true });
          }
        });
      }
    });

    await timetable.save();

    return res.status(200).json({
      success: true,
      message: "Default attendance set for the week successfully.",
    });
  } catch (error) {
    console.error("Error setting default attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set default attendance.",
      error: error.message,
    });
  }
}

