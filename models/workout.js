const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
  exercises: [
    {
      type: {type: String, trim: true}, 
      name:  {type: String, trim: true}, 
      distance: {type: Number, trim: true, default: 0}, 
      duration: {type: Number, trim: true, default: 0}, 
      weight: {type: Number, trim: true}, 
      sets: {type: Number, trim: true, default: 0}, 
      reps: {type: Number, trim: true, default: 0}, 
      //key: {type: data type, trim: remove whitespace, default: integer here}
    }
  ]
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;