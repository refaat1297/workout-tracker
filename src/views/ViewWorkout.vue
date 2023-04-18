<script setup>

  import {supabase} from "@/supabase/init.js";
  import {ref, computed} from "vue";
  import {useRoute, useRouter} from "vue-router";
  import store from "@/store";
  import {uid} from "uid";

  const data = ref(null)
  const dataLoaded = ref(null)
  const errorMsg = ref(null)
  const statusMsg = ref(null)
  const route = useRoute()
  const router = useRouter()

  const currentId = route.params.id
  const user = computed(() => store.state.user)

  // get workout data
  async function getData () {
    try {
      const { data: workout, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', currentId)


      if (error) throw error

      data.value = workout[0]
      dataLoaded.value = true
    } catch (error) {
      errorMsg.value = `Error: ${error.message}`
      setTimeout(() => errorMsg.value = null, 5000)
    }
  }

  getData()


  // Edit mode
  const edit = ref(false)
  const editMode = () => edit.value = !edit.value

  // Delete Workout
  async function deleteWorkout () {
    try {
      const { error } = await supabase
          .from('workouts')
          .delete()
          .eq('id', currentId)

      if (error) throw error

      await router.push({name: 'home'})
    } catch (error) {
      errorMsg.value = `Error: ${error.message}`
      setTimeout(() => errorMsg.value = null, 5000)
    }
  }

  // Add Exercise

  function addExercise () {
    if (data.value.type === 'strength') {
      data.value.exercises.push({
        id: uid(),
        exercise: '',
        sets: '',
        pets: '',
        weight: ''
      })
      return
    }

    data.value.exercises.value.push({
      id: uid(),
      cardioType: '',
      distance: '',
      duration: '',
      pace: ''
    })
  }

  // Delete Exercise
  function deleteExercise (id) {
    if (data.value.exercises.length < 2) {
      errorMsg.value = `Error: Can't remove, need to at least have one exercise`
      setTimeout(() => errorMsg.value = null, 5000)
      return
    }
    data.value.exercises = data.value.exercises.filter(el => el.id !== id)
  }

  // Update Workout

  async function updateWorkout () {
    try {
      const { error } = await supabase
          .from('workouts')
          .update(data.value)
          .eq('id', currentId)

      if (error) throw error

      edit.value = false
      statusMsg.value = `Success: Workout Updated`
      setTimeout(() => statusMsg.value = null, 5000)
    } catch (error) {
      errorMsg.value = `Error: ${error.message}`
      setTimeout(() => errorMsg.value = null, 5000)
    }
  }



</script>

<template>
  <div class="max-w-screen-sm mx-auto px-4 py-10">
    <!--  App Message  -->
    <div v-if="statusMsg || errorMsg" class="mb-10 p-4 rounded-md shadow-md bg-light-grey">
      <p class="text-at-light-green">{{ statusMsg }}</p>
      <p class="text-red-500">{{ errorMsg }}</p>
    </div>

    <div v-if="dataLoaded">
      <!--  General Workout Info  -->
      <div class="flex flex-col items-center p-8 rounded-md shadow-md bg-light-grey relative">
        <div v-if="user" class="flex absolute left-2 top-2 gap-x-2">
          <div @click="editMode" class="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer bg-at-light-green shadow-lg">
            <img class="h-3.5 w-auto" src="@/assets/images/pencil-light.png" alt="">
          </div>

          <div @click="deleteWorkout" class="h-7 w-7 rounded-full flex justify-center items-center cursor-pointer bg-at-light-green shadow-lg">
            <img class="h-3.5 w-auto" src="@/assets/images/trash-light.png" alt="">
          </div>
        </div>

        <img v-if="data.type === 'cardio'" class="h-24 w-auto" src="@/assets/images/running-light-green.png" alt="">
        <img v-else class="h-24 w-auto" src="@/assets/images/dumbbell-light-green.png" alt="">

        <span class="mt-6 py-1.5 px-5 text-xs text-white bg-at-light-green rounded-lg shadow-md capitalize">{{ data.type }}</span>

        <div class="w-full mt-6">
          <input
            v-if="edit"
            v-model="data.name"
            type="text"
            class="p-2 w-full text-gray-500 focus:outline-none">
          <h1 v-else class="text-at-light-green text-2xl text-center capitalize">{{ data.name }}</h1>
        </div>
      </div>

      <!--  Exercises  -->
      <div class="mt-10 p-8 rounded-md flex flex-col items-center bg-light-grey shadow-md">
        <!--  Strength Training  -->
        <div v-if="data.type === 'strength'" class="flex flex-col gap-y-4 w-full">
          <div v-for="item in data.exercises" :key="item.id" class="flex flex-col gap-x-6 gap-y-2 relative sm:flex-row">
            <div class="flex flex-2 flex-col md:w-1/3">
              <label for="exercise-name" class="mb-1 text-sm text-at-light-green">Exercise:</label>
              <input
                v-if="edit" v-model="item.exercise" type="text" id="exercise-name"
                class="p-2 w-full text-gray-500 focus:outline-none">
              <p v-else class="capitalize">{{ item.exercise }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <label for="sets" class="mb-1 text-sm text-at-light-green">Sets:</label>
              <input
                  v-if="edit" v-model="item.sets" type="text" id="sets"
                  class="p-2 w-full text-gray-500 focus:outline-none">
              <p v-else>{{ item.sets }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <label for="reps" class="mb-1 text-sm text-at-light-green">Reps:</label>
              <input
                  v-if="edit" v-model="item.reps" type="text" id="reps"
                  class="p-2 w-full text-gray-500 focus:outline-none">
              <p v-else>{{ item.reps }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <label for="weight" class="mb-1 text-sm text-at-light-green">Weight (LB's):</label>
              <input
                  v-if="edit" v-model="item.weight" type="text" id="weight"
                  class="p-2 w-full text-gray-500 focus:outline-none">
              <p v-else>{{ item.weight }}</p>
            </div>

            <img v-if="edit" @click="deleteExercise(item.id)" class="absolute h-4 w-auto -left-5 cursor-pointer" src="@/assets/images/trash-light-green.png" alt="">
          </div>

          <button
            v-if="edit"
            @click="addExercise"
            type="button"
            class="
              mt-6 py-2 px-6 rounded-sm self-start text-sm text-white
              bg-at-light-green duration-200 border-solid border-2 border-transparent
              hover:border-at-light-green hover:bg-white hover:text-at-light-green">Add Exercise</button>
        </div>

        <!--  Cardio  -->
        <div v-else class="flex flex-col gap-y-4 w-full">
          <div v-for="item in data.exercises" :key="item.id" class="flex flex-col gap-x-6 gap-y-2 relative sm:flex-row">
            <div class="flex flex-2 flex-col md:w-1/3">
              <label for="cardio-type" class="mb-1 text-sm text-at-light-green">Type:</label>
              <select
                  v-if="edit" v-model="item.cardioType" type="text" id="cardio-type"
                  class="p-2 w-full text-gray-500 focus:outline-none">
                <option value="#">Select Type:</option>
                <option value="run">Run</option>
                <option value="walk">Walk</option>
              </select>
              <p v-else class="capitalize">{{ item.cardioType }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <label for="distance" class="mb-1 text-sm text-at-light-green">Distance:</label>
              <input
                  v-if="edit" v-model="item.distance" type="text" id="distance"
                  class="p-2 w-full text-gray-500 focus:outline-none">
              <p v-else>{{ item.distance }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <label for="duration" class="mb-1 text-sm text-at-light-green">Duration:</label>
              <input
                  v-if="edit" v-model="item.duration" type="text" id="duration"
                  class="p-2 w-full text-gray-500 focus:outline-none">
              <p v-else>{{ item.duration }}</p>
            </div>

            <div class="flex flex-1 flex-col">
              <label for="pace" class="mb-1 text-sm text-at-light-green">Pace:</label>
              <input
                  v-if="edit" v-model="item.pace" type="text" id="pace"
                  class="p-2 w-full text-gray-500 focus:outline-none">
              <p v-else>{{ item.pace }}</p>
            </div>

            <img v-if="edit" @click="deleteExercise(item.id)" class="absolute h-4 w-auto -left-5 cursor-pointer" src="@/assets/images/trash-light-green.png" alt="">
          </div>

          <button
            v-if="edit"
            @click="addExercise"
            type="button"
            class="
              mt-6 py-2 px-6 rounded-sm self-start text-sm text-white
              bg-at-light-green duration-200 border-solid border-2 border-transparent
              hover:border-at-light-green hover:bg-white hover:text-at-light-green">Add Exercise</button>
        </div>
      </div>

      <!--  Update  -->
      <button
        v-if="edit"
        @click="updateWorkout"
        type="button"
        class="
          mt-10 py-2 px-6 rounded-sm self-start text-sm text-white
          bg-at-light-green duration-200 border-solid border-2 border-transparent
          hover:border-at-light-green hover:bg-white hover:text-at-light-green">Update Workout</button>
    </div>
  </div>
</template>

