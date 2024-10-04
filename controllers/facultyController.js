import faculty from '../models/faculty/signup.js';
import Timetable from '../models/faculty/timetable.js';
import { sendResponse } from '../utils/ResponseHandle.js';
import { getTimetable, getDateOfWeek, getFacultyId } from '../utils/Helper.js';


export async function setTimeTable(req, res) {
  try {
    const { timetableId, schedule } = req.body;
    const setTTId = await faculty.findOneAndUpdate({ _id: getFacultyId(req) }, { $set: { timetableId: timetableId } })
    if (!setTTId) {
      return sendResponse(res, 500, false, "Failed to Find the Faculty Timetable ID")
    }

    const timetable = new Timetable({
      timetableId,
      schedule,
    });

    await timetable.save();
    return sendResponse(res, 201, true, "Timetable uploaded successfully")
  } catch (error) {
    return sendResponse(res, 500, false, error.message)
  }
}

export async function getUserName(req, res) {
  const { name } = await faculty.findOne({ _id: getFacultyId(req) })
  if (!name) {
    return sendResponse(res, 400, false, "User name reterival Failed")
  }
  return sendResponse(res, 200, true, "User's name reterive successfully", name)
}

export async function getSchedule(req, res) {
  try {
    const timetable = await getTimetable(req);
    return sendResponse(res, 200, true, "Successfully fetched the schedule", timetable)
  } catch (error) {
    return sendResponse(res, 500, false, error.message)
  }
}

export async function updateAttendence(req, res) {
  const { periodId, date, status } = req.body;
  try {
    const timetable = await Timetable.findOne({
      "schedule.periods.periodId": periodId,
    });
    console.log(timetable.timetableId, "&&&&")
    if (!timetable) {
      return sendResponse(res, 404, false, "Period not found in the timetable")
    }

    const day = timetable.schedule.find((daySchedule) => {
      return daySchedule.periods.find((period) => period.periodId === periodId)
    });

    if (!day) {
      return sendResponse(res, 404, false, "Day not found in the timetable")
    }

    const period = day.periods.find((p) => p.periodId === periodId);
    if (!period) {
      return sendResponse(res, 404, false, "PeriodId not found in the timetable")
    }

    const existingRecord = period.attendanceRecords.find(record => record.date === date);
    if (existingRecord) {
      existingRecord.attended = (status === "no") ? false : true;
    } else {
      period.attendanceRecords.push({ date, attended: (status == "no") ? false : true });
    }

    timetable.markModified('schedule');

    const tt = await timetable.save();
    return sendResponse(res, 200, true, "SAttendance updated successfully")
   
  } catch (error) {
    return sendResponse(res, 500, false, error.message)
  }
};

export async function setDefaultAttendence(req, res) {
  try {
    const timetable = await getTimetable(req);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    timetable.schedule.forEach((daySchedule) => {
      if (daysOfWeek.includes(daySchedule.day)) {
        const date = getDateOfWeek(daySchedule.day);

        daySchedule.periods.forEach(period => {
          const existingRecord = period.attendanceRecords.find(record => record.date === date);
          if (!existingRecord) {
            period.attendanceRecords.push({ date, attended: true });
          }
        });
      }
    });

    await timetable.save();
    return sendResponse(res, 200, true, "Default attendance set for the week successfully")
  } catch (error) {
    return sendResponse(res, 500, false, error.message)
  }
}

export async function getTodayAttendence(req, res) {
  const { currDay, currDate } = req.body
  try {
    const timetable = await getTimetable(req)
    const day = timetable.schedule.find((Day) => Day.day === currDay)

    if (!day) {
      return res.status(404).json({ error: "Day schedule not found" })
    }
    const attendedPeriod=[]

    day.periods.forEach((period) => {
      let attendanceRecords = period.attendanceRecords;
      const existingRecord = attendanceRecords.find(record => record.date === currDate)

      if (existingRecord.attended) {
        attendedPeriod.push({ periodId: period.periodId, date:currDate, attended: true})
      } else {
        attendedPeriod.push({ periodId: period.periodId, date:currDate, attended: false })
      }
    });

    return res.status(200).json({ message: "Attendance updated successfully",success: true, attendence:attendedPeriod })

  } catch (error) {
    console.error("Error setting attendance:", error);
    return res.status(500).json({ message: "An error occurred while updating attendance" , success:false, attendence:attendedPeriod})
  }
}


