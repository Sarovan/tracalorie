class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }

  // Public methods/API

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._displayNewMeal(meal);
    this._renderStats();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._displayNewWorkout(workout);
    this._renderStats();
  }

  removeMeal() {
    console.log('meal removed');
  }

  removeWorkout() {
    console.log('workout removed');
  }

  // Private methods

  _displayCaloriesLimit() {
    document.getElementById('calories-limit').innerHTML = this._calorieLimit;
  }

  _displayCaloriesTotal() {
    document.getElementById('calories-total').innerHTML = this._totalCalories;
  }

  _displayCaloriesConsumed() {
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    document.getElementById('calories-consumed').innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    document.getElementById('calories-burned').innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById('calories-remaining');
    const progressEl = document.getElementById('calorie-progress');

    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        'bg-success'
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        'bg-danger'
      );
      progressEl.classList.remove('bg-success');
      progressEl.classList.add('bg-danger');
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        'bg-success'
      );
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      progressEl.classList.add('bg-success');
      progressEl.classList.remove('bg-danger');
    }
  }

  _displayCaloriesProgress() {
    const progressEl = document.getElementById('calorie-progress');
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressEl.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealItems = document.getElementById('meal-items');

    const div = document.createElement('div');
    div.classList.add('card', 'my-2');
    div.setAttribute('data-id', meal.id);
    div.innerHTML = `<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>`;
    mealItems.appendChild(div);
  }

  _displayNewWorkout(workout) {
    const workoutItems = document.getElementById('workout-items');

    const div = document.createElement('div');
    div.classList.add('card', 'my-2');
    div.setAttribute('data-id', workout.id);
    div.innerHTML = `<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>`;
    workoutItems.appendChild(div);
  }

  _renderStats() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
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

class App {
  constructor() {
    this._tracker = new CalorieTracker();

    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this));

    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'));
  }

  _newItem(e) {
    e.preventDefault();

    let name, calories;

    if (e.target.id === 'meal-form') {
      name = document.getElementById('meal-name');
      calories = document.getElementById('meal-calories');
    } else if (e.target.id === 'workout-form') {
      name = document.getElementById('workout-name');
      calories = document.getElementById('workout-calories');
    }

    if (name.value === '' || calories.value === '') {
      alert('Please fill in all fields');
      return;
    }

    if (e.target.id === 'meal-form') {
      const meal = new Meal(name.value, Number(calories.value));
      this._tracker.addMeal(meal);
    } else if (e.target.id === 'workout-form') {
      const workout = new Workout(name.value, Number(calories.value));
      this._tracker.addWorkout(workout);
    }

    name.value = '';
    calories.value = '';

    const collapse = e.target.parentElement.parentElement;
    const bsCollapse = new bootstrap.Collapse(collapse, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id');

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);
        // e.target.closest('.card').remove();
      }
    }
  }
}

const app = new App();

const meal = new Meal('Lunch', 123);
app._tracker.addMeal(meal);
const workout = new Workout('Swim', 500);
app._tracker.addWorkout(workout);
