import express from "express";
import {
  createNewUniversity,
  updateUniversity,
  getUniversities,
  getUniversity,
  deleteUniversity,
  getByExtension,
} from "../controllers/universityController.js";
const router = express.Router();

// Router To Add University to DB
router.post("/add", createNewUniversity);

// Router to get University by id
router.get("/fetchByid/:id", getUniversity);

// Router to Get all universities
router.get("/fetch", getUniversities);

// Router to delete university
router.delete("/delete/:id", deleteUniversity);

// Router to update university
router.patch("/update/:id", updateUniversity);

// Router to getByExtension university
router.get("/getByExtension/:extension", getByExtension);

export default router;
