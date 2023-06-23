import University from "../models/University.js";

export const createNewUniversity = async (req, res) => {
  try {
    const { name, extension } = req.body;

    const newUniversity = new University({ name, extension });
    await newUniversity.save();

    if (newUniversity) {
      res.status(201).send("University created successfully.");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getUniversities = async (req, res) => {
  University.find()
    .then((Universities) => res.json(Universities))
    .catch((err) => res.status(400).json("Error: " + err));
};

export const getUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    const foundUniversity = await University.findById(id);

    if (foundUniversity) {
      res.json(foundUser);
    }
  } catch (err) {
    console.log(err);
    throw new Error("An error occurred while retrieving the University.");
  }
  res.end();
};

export const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    await University.findByIdAndRemove(id);
    res.status(200).send("University deleted successfully.");
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateUniversity = async (req, res) => {
  console.log("Inside update user api");
  try {
    const { id } = req.params;
    console.log("Body of update university:");
    console.log(req.body);
    const universityRes = await University.updateOne(
      { _id: id },
      { $set: req.body }
    );
    if (universityRes) {
      res.status(200).json({ message: "University Updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "University Update Failed" });
  }
};

export const getByExtension = async (req, res) => {
  try {
    const { extension } = req.params;
    console.log("Inside getByExtension while signing up!!!");
    const university = await University.findOne({ extension: extension });
    console.log("university: ", university);
    if (university) {
      return res.json({ universityFound: true });
    }
    else
    {
      console.log("University not found (in API)!");
      return res.json({ universityFound: false });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "University get Failed" });
  }
};
