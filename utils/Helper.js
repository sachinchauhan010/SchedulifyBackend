import moment from 'moment'
import jwt from 'jsonwebtoken'
import Timetable from '../models/faculty/timetable.js';
import faculty from '../models/faculty/signup.js';

export const getFacultyId = (req) => {
  const encodedToken = req.cookies?.facultyToken
  if (!encodedToken) return null

  const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET)
  return decodedToken?.id
}



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



export function getDateOfWeek(dayOfWeek) {
  return moment().day(dayOfWeek).format('DD/MM/YYYY');
}