<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { ref, onMounted } from 'vue';
import { fetchAuthSession } from "aws-amplify/auth";

// Reactive variable to track if the user is an Admin
const isAdmin = ref(false);

async function currentSession() {
  try {
    const { accessToken } = (await fetchAuthSession()).tokens ?? {};
    console.log('User is in groups: ' + accessToken.payload["cognito:groups"]);
    // Check if the user is in the Admin group
    isAdmin.value = accessToken.payload["cognito:groups"]?.includes("Admin") || false;
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  currentSession(); // Call the function when the component is mounted
});
</script>

<template>
  <div class="home">
    <h1>Welcome to the Fantasy Golf App!</h1>
    <authenticator>
      <template v-slot="{ user, signOut }">
        <h1>Hello {{ user?.signInDetails?.loginId }}</h1>
        <Todos />
        <button @click="signOut">Sign Out</button>
      </template>
    </authenticator>
    <p>This is your go-to place for managing golf tournaments and other activities.</p>

    <!-- Only show this link if the user is an Admin -->
    <div v-if="isAdmin">
      <router-link to="/admin">Go to Admin Page</router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
</style>
