<script setup>

  import {supabase} from "@/supabase/init.js";
  import {computed, ref} from "vue";
  import store from "@/store/index.js";


  const data = ref([])
  const dataLoaded = ref(null)

  const user = computed(() => store.state.user)


  async function getData () {
    try {
      const { data: workouts, error } = await supabase
          .from('workouts')
          .select('*')

      if (error) throw error

      data.value = workouts
      dataLoaded.value = true
    } catch (error) {
      console.warn(error.message)
    }
  }



  getData()
</script>

<template>
  <div v-if="dataLoaded" class="container mt-10 px-4">
    <!--  No Data  -->
    <div v-if="data.length === 0" class="w-full flex flex-col items-center text-center">
      <h1 class="text-2xl">Looks empty here...</h1>
      <router-link
          v-if="user"
          class="
            mt-6 py-2 px-6 rounded-sm text-sm text-white
            bg-at-light-green duration-200 border-solid border-2 border-transparent
            hover:border-at-light-green hover:bg-white hover:text-at-light-green"
          :to="{ name: 'create' }">Create Workout</router-link>
    </div>

    <!--  Display Data  -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <router-link
        :to="{ name: 'view-workout', params: { id: workout.id } }"
        v-for="workout in data" :key="workout.id"
        class="flex flex-col items-center bg-light-grey p-8 shadow-md cursor-pointer">

        <!--  Cardio Image  -->
        <img v-if="workout.type === 'cardio'" src="@/assets/images/running-light-green.png" class="h-24 w-auto" alt="">

        <!--  Strength Training Image  -->
        <img v-else src="@/assets/images/dumbbell-light-green.png" class="h-24 w-auto" alt="">

        <p class="mt-6 py-1 px-3 text-xs text-white bg-at-light-green shadow-md rounded-lg capitalize">{{ workout.type }}</p>

        <h1 class="mt-8 mb-2 text-center text-xl text-at-light-green capitalize">{{ workout.name }}</h1>
      </router-link>
    </div>
  </div>
</template>
