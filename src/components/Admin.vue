<template>
  <div class="admin-container">
    <h2>Admin Panel</h2>
    <h3>Select a Tournament</h3>
    
    <!-- Dropdown for tournaments -->
    <select v-model="tourId" :disabled="loading">
      <option value="" disabled>Select a Tournament</option>
      <option v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    
    <!-- Loading indicator -->
    <p v-if="loading">Loading tournaments...</p>
    
    <!-- Alert message -->
    <p v-if="alertMessage">{{ alertMessage }}</p>
    
    <!-- Submit button to perform an action with the selected tournament -->
    <button @click="handleSubmit" :disabled="tourId === 0">Submit</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createGolfer as createGolferMutation } from '../graphql/mutations.js'; // Import your mutation if needed
import { API } from 'aws-amplify'; // Ensure you have AWS Amplify set up if you're using it

const loading = ref(true);
const items = ref([]);
const tourId = ref(0);
const alertMessage = ref("");

// Fetch tournaments from the API
async function getTours() {
  try {
    const response = await fetch(
      "https://api.sportsdata.io/golf/v2/json/Tournaments?key=161ad371b51b46f38d06a248ac302e26"
    );

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    console.log("Fetched tournaments");

    // Mapping response to items
    items.value = res.map(({ Name, TournamentID, StartDate }) => ({
      label: `${StartDate.slice(0, 10)} ${Name}`,
      value: TournamentID,
    }));

    console.log(items.value); // Log the items to see if they are correctly populated
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    alertMessage.value = "Failed to load tournaments.";
  } finally {
    loading.value = false; // Stop loading regardless of success or error
  }
}

// Handle submission of selected tournament
async function handleSubmit() {
  if (tourId.value) {
    alertMessage.value = `You selected tournament ID: ${tourId.value}`;
    
    // Optional: Call a function to handle creating golfers
    await createGolfers(tourId.value);
  } else {
    alertMessage.value = "Please select a tournament.";
  }
}

// Function to create golfers using your mutation
async function createGolfers(tournamentId) {
  // Example of creating golfers; adapt as needed
  console.log("Creating golfers for tournament ID:", tournamentId);
  // Call your API or logic to create golfers based on the selected tournament ID
}

// Fetch tournaments on component mount
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
