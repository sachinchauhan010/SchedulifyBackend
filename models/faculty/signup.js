import mongoose from 'mongoose'

const {Schema} =mongoose;

const facultySignupSchema= new Schema({
    facultyName:{
      type:String,
      required:true,
    },

    facultyId:{
      type:String,
      required:true,
      unique:true,
    },

    facultyEmail: {
      type: String,
      required: true,
      unique:true,
    },

    facultyPassword: {
      type:String,
      required: true,
    },

    facultyTimeTable:{
      type: Array,
    }

});

const faculty= mongoose.model('faculty', facultySignupSchema );

export default faculty;