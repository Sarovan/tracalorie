class CalorieTracker {
  constructor() {
    this._calorieLimit = 1000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
  }

  _displayCaloriesLimit() {
    document.getElementById('calories-limit').innerText = this._calorieLimit;
  }

  _displayCaloriesTotal() {
    document.getElementById('calories-total').innerText = this._totalCalories;
  }
  _displayCaloriesConsumed() {
    let consumed = 0;
    for (let meal of this._meals) {
      consumed += meal.calories;
    }
    document.getElementById('calories-consumed').innerText = consumed;
  }
  _displayCaloriesBurned() {
    let burned = 0;
    for (let workout of this._workouts) {
      burned += workout.calories;
    }
    document.getElementById('calories-burned').innerText = burned;
  }
  _displayCaloriesRemaining() {
    document.getElementById('calories-remaining').innerText =
      document.getElementById('calories-consumed').innerText -
      document.getElementById('calories-burned').innerText;
  }

  _renderStats() {
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast', 400);
tracker.addMeal(breakfast);
tracker.addMeal(breakfast);

const run = new Workout('Morning Run', 300);
tracker.addWorkout(run);
tracker.addWorkout(run);

tracker._renderStats();

console.log(tracker._meals);
