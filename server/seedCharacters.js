import mongoose from "mongoose";
import fs from "fs";
import { Character } from "./Models/Character.js";

await mongoose.connect(
  "mongodb+srv://sickd80_db_user:yI66sf2lMFnYQAAG@animeclash.vzxvr16.mongodb.net/"
);

const data = JSON.parse(fs.readFileSync("./Data/Characters.json", "utf8"));

await Character.deleteMany({});
await Character.insertMany(data);

console.log("✅ Characters seeded successfully!");
mongoose.connection.close();
