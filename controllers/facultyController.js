import faculty from '../models/faculty/signup.js';
import jwt from 'jsonwebtoken'

export const getFacultyId = (req) => {
  const encodedToken = req.cookies?.facultyToken
  if (!encodedToken) return null

  const decodedToken = jwt.verify(encodedToken, process.env.JWT_SECRET)
  return decodedToken?.id
}

export async function setTimeTable(req, res) {
  const timetableData = req.body;

  try {
    const setTT = await faculty.findOneAndUpdate({ _id: getFacultyId(req) }, { $push: { setTimeTable: timetableData } })

    if (!setTT) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      })
    }
    return res.status(200).json({
      success: true,
      message: "Time Table saved to DB",
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }

}

export async function getUserName(req, res) {
  const {name}= await faculty.findOne({_id: getFacultyId(req)})

  if(!name){
    return res.status(400).json({
      success: false,
      message: "User's Name retrieve failed"
    });
  }

  return res.status(200).json({
    success:true,
    message: "User's name retrieve successfully",
    userData: name
  })
}