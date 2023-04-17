<script setup>
  import {supabase} from "@/supabase/init.js";
  import {useRouter} from "vue-router";
  import store from "@/store";
  import {computed} from "vue";

  const router = useRouter()

  const user = computed(() => store.state.user)

  async function logout () {
    await supabase.auth.signOut()
    await router.push({name: 'login'})
  }

</script>

<template>
  <header class="bg-at-light-green text-white">
    <nav class="container py-5 px-4 flex flex-col gap-4 items-center sm:flex-row">
      <div class="flex items-center gap-x-4">
        <img class="w-14" src="@/assets/images/dumbbell-light.png" alt="">
        <h1 class="text-lg">Active Tracker</h1>
      </div>

      <ul class="flex flex-1 justify-end gap-x-10">
        <router-link class="cursor-pointer" :to="{ name: 'home' }" tag="li">Home</router-link>
        <template v-if="user">
          <router-link class="cursor-pointer" :to="{ name: '' }" tag="li">Create</router-link>
          <li class="cursor-pointer" @click="logout">Logout</li>
        </template>
        <router-link v-else class="cursor-pointer" :to="{ name: 'login' }" tag="li">Login</router-link>
      </ul>
    </nav>
  </header>
</template>

<style scoped>

</style>
