<script setup>

  import {ref} from "vue";
  import { uid } from "uid";
  import {supabase} from "@/supabase/init.js";


  const workoutName = ref('')
  const workoutType = ref('select-workout')
  const workoutExercises = ref([])
  const statusMsg = ref(null)
  const errorMsg = ref(null)


  function addExercise () {
    if (workoutType.value === 'strength') {
      workoutExercises.value.push({
        id: uid(),
        exercise: '',
        sets: '',
        pets: '',
        weight: ''
      })
      return
    }

    workoutExercises.value.push({
      id: uid(),
      cardioType: '',
      distance: '',
      duration: '',
      pace: ''
    })
  }

  const workoutChange = () => {
    workoutExercises.value = []
    addExercise()
  }

  function deleteExercise (id) {
    if (workoutExercises.value.length < 2) {
      errorMsg.value = `Error: Can't remove, need to at least have one exercise`
      setTimeout(() => errorMsg.value = null, 5000)
      return
    }
    workoutExercises.value = workoutExercises.value.filter(el => el.id !== id)
  }

  async function createWorkout () {
    try {
      const {error} = await supabase
          .from('workouts')
          .insert([{
            name: workoutName.value,
            type: workoutType.value,
            exercises: workoutExercises.value
          }])

      if (error) throw error

      statusMsg.value = 'Success: Workout Created!'

      workoutName.value = null
      workoutType.value = 'select-workout'
      workoutExercises.value = []

      setTimeout(() => statusMsg.value = null, 5000)
    } catch (error) {
      errorMsg.value = `Error: ${error.message}`
      setTimeout(() => errorMsg.value = null, 5000)
    }
  }



</script>

<template>
  <div class="max-w-screen-md mx-auto px-4 py-10">
    <!--  Status Message  -->
    <div v-if="statusMsg || errorMsg" class="mb-10 p-4 bg-light-grey rounded-md shadow-lg">
      <p class="text-at-light-green">{{ statusMsg }}</p>
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <!--  Create Form  -->
    <div class="p-8 flex items-start bg-light-grey rounded-md shadow-lg">
      <form @submit.prevent="createWorkout" class="flex flex-col gap-y-5 w-full">
        <h1 class="text-2xl text-at-light-green">Record Workout</h1>

        <!--  Workout Name  -->
        <div class="flex flex-col">
          <label for="workout-name" class="mb-1 text-sm text-at-light-green">Workout Name:</label>
          <input v-model="workoutName" type="text" id="workout-name" required class="p-2 text-gray-500 focus:outline-none">
        </div>

        <!--  Workout Type  -->
        <div class="flex flex-col">
          <label for="workout-type" class="mb-1 text-sm text-at-light-green">Workout Type:</label>
          <select v-model="workoutType" @change="workoutChange" id="workout-type" class="p-2 text-gray-500 focus:outline-none" required>
            <option value="select-workout">Select Workout</option>
            <option value="strength">Strength Training</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>

        <!--  Strength Training Inputs  -->
        <div v-if="workoutType === 'strength'" class="flex flex-col gap-y-4">
          <div v-for="item in workoutExercises" :key="item.id" class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row">
            <div class="flex flex-col md:w-1/3">
              <label for="exercise-name" class="mb-1 text-sm text-at-light-green">Exercise:</label>
              <input v-model="item.exercise" type="text" class="p-2 w-full text-gray-500 focus:outline-none" required>
            </div>

            <div class="flex flex-col flex-1">
              <label for="sets" class="mb-1 text-sm text-at-light-green">Sets:</label>
              <input v-model="item.sets" type="text" class="p-2 w-full text-gray-500 focus:outline-none" required>
            </div>

            <div class="flex flex-col flex-1">
              <label for="reps" class="mb-1 text-sm text-at-light-green">Reps:</label>
              <input v-model="item.reps" type="text" class="p-2 w-full text-gray-500 focus:outline-none" required>
            </div>

            <div class="flex flex-col flex-1">
              <label for="weight" class="mb-1 text-sm text-at-light-green">Weight (LB's):</label>
              <input v-model="item.weight" type="text" class="p-2 w-full text-gray-500 focus:outline-none" required>
            </div>

            <img @click="deleteExercise(item.id)" src="@/assets/images/trash-light-green.png" class="h-4 w-auto absolute -left-5 cursor-pointer" alt="">
          </div>

          <button
              @click="addExercise"
              type="button"
              class="
                  mt-6 py-2 px-6 rounded-sm self-start text-sm text-white
                  bg-at-light-green duration-200 border-solid border-2 border-transparent
                  hover:border-at-light-green hover:bg-white hover:text-at-light-green">Add Exercise</button>
        </div>

        <!--  Cardio Inputs  -->
        <div v-if="workoutType === 'cardio'" class="flex flex-col gap-y-4">
          <div v-for="item in workoutExercises" :key="item.id" class="flex flex-col gap-x-6 gap-y-2 relative md:flex-row">
            <div class="flex flex-col md:w-1/3">
              <label for="cardio-type" class="mb-1 text-sm text-at-light-green">Type:</label>
              <select v-model="item.cardioType" id="cardio-type" class="p-2 w-full text-gray-500 focus:outline-none">
                <option value="#">Select Type:</option>
                <option value="run">Run</option>
                <option value="walk">Walk</option>
              </select>
            </div>

            <div class="flex flex-col flex-1">
              <label for="distance" class="mb-1 text-sm text-at-light-green">Distance:</label>
              <input v-model="item.distance" type="text" class="p-2 w-full text-gray-500 focus:outline-none" required>
            </div>

            <div class="flex flex-col flex-1">
              <label for="duration" class="mb-1 text-sm text-at-light-green">Duration:</label>
              <input v-model="item.duration" type="text" class="p-2 w-full text-gray-500 focus:outline-none" required>
            </div>

            <div class="flex flex-col flex-1">
              <label for="pace" class="mb-1 text-sm text-at-light-green">Pace:</label>
              <input v-model="item.pace" type="text" class="p-2 w-full text-gray-500 focus:outline-none" required>
            </div>

            <img @click="deleteExercise(item.id)" src="@/assets/images/trash-light-green.png" class="h-4 w-auto absolute -left-5 cursor-pointer" alt="">
          </div>

          <button
              @click="addExercise"
              type="button"
              class="
                  mt-6 py-2 px-6 rounded-sm self-start text-sm text-white
                  bg-at-light-green duration-200 border-solid border-2 border-transparent
                  hover:border-at-light-green hover:bg-white hover:text-at-light-green">Add Exercise</button>
        </div>

        <button
            type="submit"
            class="
            mt-6 py-2 px-6 rounded-sm self-start text-sm text-white
            bg-at-light-green duration-200 border-solid border-2 border-transparent
            hover:border-at-light-green hover:bg-white hover:text-at-light-green">Record Workout</button>
      </form>
    </div>
  </div>
</template>



<style scoped>

</style>
