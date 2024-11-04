<script setup lang="ts">
import router from './router'; // Ensure you're importing the router
import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
Amplify.configure(outputs);
</script>

<template>
  <main>
    <authenticator>
      <!-- <template v-slot="{ signOut }"> -->
        <router-view /> <!-- This will render the matched component based on the current route -->
        <!-- <button @click="signOut">Sign Out</button>
      </template> -->
    </authenticator>
  </main>
</template>
