const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")
const path = require("path")

const PORT = process.env.PORT || 3000

const db = require("./models")

const app = express()

app.use(logger("dev"))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static("public"))

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true })

// API 

//find last workout
// app.get("/api/workouts", (req, res) => {
// db.Workout.find({})
//   .then(dbWorkout => {
//     res.json(dbWorkout)
//   })
//   .catch(err => {
//     res.json(err)
//   })
// })

// find last workout
app.get("/api/workouts", (req, res) => {
  db.Workout.aggregate([
    {
      $addFields: {
        totalDuration: {$sum: "$exercises.duration"}
      }
    }
  ])
    .then(dbWorkout => {
      console.log(dbWorkout)
      res.json(dbWorkout)
    })
    .catch(err => {
      res.json(err)
    })
  })

//add workout
app.post("/api/workouts", ({ body }, res) => {
  db.Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

//add to routine ... spelled that routube almost help
app.put("/api/workouts/:id", (req, res) => { 
  console.log(req.params.id)
  db.Workout.updateOne( 
    {_id: req.params.id},
    {$push: 
      {exercises: //object containing information added by user
        {
          type: req.body.type,
          name: req.body.name,
          distance: req.body.distance,
          duration: req.body.duration,
          weight: req.body.weight,
          sets: req.body.sets,
          reps: req.body.reps,
        }
      }
    }) 
  .then(dbWorkout => {
    res.json(dbWorkout)
  })
  .catch(err => {
    res.json(err)
  })
})


// HTML

//stats route
app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/stats.html'));
});

//exercise route
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/exercise.html'));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});