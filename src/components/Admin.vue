<template>
  <div class="admin-container">
    <h2>Admin Panel</h2>
    <h3>Select a Tournament</h3>
    <div><router-link to="/">Go to Home Page</router-link></div>
    <div>
      <label for="tournamentDate">Select Tournament cut off date and time:</label>
      <VueDatePicker v-model="tournamentDate" :format="'yyyy-mm-dd HH:mm'" :enableTime="true"/>
    </div>
    <!-- Dropdown for tournaments -->
    <select v-model="tourId" :disabled="loading">
      <option value="" disabled>Select a Tournament</option>
      <option v-for="item in items" :key="item.value" :enable-time-picker="true" >
        {{ item.label }}
      </option>
    </select>
    
    <!-- Loading indicator -->
    <p v-if="loading">Loading tournaments...</p>
    
    <!-- Alert message -->
    <p v-if="alertMessage">{{ alertMessage }}</p>
    
    <!-- Submit button to perform an action with the selected tournament -->
    <button @click="handleSubmit" :disabled="tourId === null">Submit</button>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/data'
import { ref, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
const tournamentDate = ref(new Date());
interface Tournament {
  label: string;
  value: number;
}

const loading = ref(true);
const items = ref<Tournament[]>([]);
const tourId = ref<number | null>(null);
const alertMessage = ref("");
const client = generateClient<Schema>()

async function getTours() {
  try {
    const response = await fetch(
      "https://api.sportsdata.io/golf/v2/json/Tournaments?key=161ad371b51b46f38d06a248ac302e26"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    items.value = res.map(({ Name, TournamentID, StartDate }) => ({
      label: `${StartDate.slice(0, 10)} ${Name}`,
      value: TournamentID,
    }));
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    alertMessage.value = "Failed to load tournaments. Please try again later.";
  } finally {
    loading.value = false; // Stop loading regardless of success or error
  }
}

async function handleSubmit() {
  if (tourId.value) {
    alertMessage.value = `You selected tournament ID: ${tourId.value}`;
    await client.models.Admin.create({
      // Date: tournamentDate.toString(),
      TournamentID: tourId.toString()
    })
  } else {
    alertMessage.value = "Please select a tournament.";
  }
}



onMounted(getTours);
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

h2 {
  margin-bottom: 10px;
}

h3 {
  margin-bottom: 10px;
}

select {
  margin-bottom: 10px;
}
</style>
