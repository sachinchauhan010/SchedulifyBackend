import faculty from '../models/faculty/signup.js';
import jwt from 'jsonwebtoken'
import Timetable from '../models/faculty/timetable.js';

export const getFacultyId = (req) => {
  const encodedToken = req.cookies?.facultyToken
  if (!encodedToken) return null

  const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET)
  return decodedToken?.id
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

    const timetableSaved=await timetable.save();
    console.log(timetableSaved, "&&&&&7")
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
  const { timetableId } = await faculty.findOne({ _id: getFacultyId(req) })
  if (!timetableId) {
    return res.status(500).json({
      success: false,
      messgae: "Failed to fetch the Schedules"
    })
  }
  const timetable = await Timetable.findOne({ timetableId: timetableId });

  if (!timetable) {
    return res.status(500).json({
      success: false,
      messgae: "Failed to fetch the Schedules"
    })
  }
  return res.status(200).json({
    success: true,
    messgae: "Successfully fetch the Schedules",
    data: timetable
  })

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

    // Find the period
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
      // Update the existing record
      existingRecord.status = status;
    } else {
      // Add a new attendance record
      period.attendanceRecords.push({ date, status });
    }

    await timetable.save();

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

