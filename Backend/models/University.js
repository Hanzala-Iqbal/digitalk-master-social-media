import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UniversitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  extension: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
});

const University = mongoose.model("University", UniversitySchema);

export default University;
