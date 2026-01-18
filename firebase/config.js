// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4b47hPA2wGYWUIhkajcnWSUb8w_gQduU",
  authDomain: "labourhiringindia.firebaseapp.com",
  databaseURL: "https://labourhiringindia-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "labourhiringindia",
  storageBucket: "labourhiringindia.firebasestorage.app",
  messagingSenderId: "1057256057838",
  appId: "1:1057256057838:web:7a3b1a9e7a820a22dd3cff",
  measurementId: "G-46XRJ8RJCM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Check karo ki Firebase available hai ya nahi
if (typeof firebase !== 'undefined') {
    try {
        // Firebase initialize karo
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase initialized successfully!");
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
} else {
    console.log("Firebase not available. Using localStorage for demo.");
}

// Temporary localStorage functions for demo
const LocalStorageDB = {
    // Users collection
    users: {
        get: () => {
            const users = localStorage.getItem('labourhub_users');
            return users ? JSON.parse(users) : [];
        },
        set: (users) => {
            localStorage.setItem('labourhub_users', JSON.stringify(users));
        },
        add: (user) => {
            const users = LocalStorageDB.users.get();
            users.push(user);
            LocalStorageDB.users.set(users);
            return user;
        },
        findById: (id) => {
            const users = LocalStorageDB.users.get();
            return users.find(user => user.id === id);
        },
        findByEmail: (email) => {
            const users = LocalStorageDB.users.get();
            return users.find(user => user.email === email);
        }
    },

    // Workers collection
    workers: {
        get: () => {
            const workers = localStorage.getItem('labourhub_workers');
            return workers ? JSON.parse(workers) : [];
        },
        set: (workers) => {
            localStorage.setItem('labourhub_workers', JSON.stringify(workers));
        },
        add: (worker) => {
            const workers = LocalStorageDB.workers.get();
            workers.push(worker);
            LocalStorageDB.workers.set(workers);
            return worker;
        },
        findByAreaAndProfession: (area, profession) => {
            const workers = LocalStorageDB.workers.get();
            return workers.filter(worker => {
                const areaMatch = area ? worker.area.toLowerCase().includes(area.toLowerCase()) : true;
                const professionMatch = profession ? worker.profession === profession : true;
                return areaMatch && professionMatch;
            });
        },
        findByProfessional: (professionalId) => {
            const workers = LocalStorageDB.workers.get();
            return workers.filter(worker => worker.addedBy === professionalId);
        }
    },

    // Areas collection
    areas: {
        get: () => {
            const areas = localStorage.getItem('labourhub_areas');
            if (areas) return JSON.parse(areas);
            
            // Default areas agar nahi hai
            const defaultAreas = [
                { id: '1', name: 'Delhi', workers: 150 },
                { id: '2', name: 'Mumbai', workers: 200 },
                { id: '3', name: 'Bangalore', workers: 180 },
                { id: '4', name: 'Chennai', workers: 120 },
                { id: '5', name: 'Kolkata', workers: 100 },
                { id: '6', name: 'Hyderabad', workers: 140 }
            ];
            LocalStorageDB.areas.set(defaultAreas);
            return defaultAreas;
        },
        set: (areas) => {
            localStorage.setItem('labourhub_areas', JSON.stringify(areas));
        }
    },

    // Professions collection
    professions: {
        get: () => {
            const professions = localStorage.getItem('labourhub_professions');
            if (professions) return JSON.parse(professions);
            
            // Default professions
            const defaultProfessions = [
                { id: '1', name: 'Electrician', hindiName: 'इलेक्ट्रीशियन', icon: '⚡', workers: 45 },
                { id: '2', name: 'Plumber', hindiName: 'प्लम्बर', icon: '🔧', workers: 38 },
                { id: '3', name: 'Mason', hindiName: 'राज मिस्त्री', icon: '🧱', workers: 52 },
                { id: '4', name: 'Painter', hindiName: 'पेंटर', icon: '🎨', workers: 28 },
                { id: '5', name: 'Carpenter', hindiName: 'बढ़ई', icon: '🔨', workers: 34 },
                { id: '6', name: 'Driver', hindiName: 'ड्राइवर', icon: '🚗', workers: 67 },
                { id: '7', name: 'Cleaner', hindiName: 'सफाई कर्मचारी', icon: '🧹', workers: 89 },
                { id: '8', name: 'Welder', hindiName: 'वेल्डर', icon: '🔥', workers: 23 },
                { id: '9', name: 'Mechanic', hindiName: 'मैकेनिक', icon: '🔩', workers: 41 },
                { id: '10', name: 'Cook', hindiName: 'रसोइया', icon: '👨‍🍳', workers: 56 },
                { id: '11', name: 'Gardener', hindiName: 'माली', icon: '🌿', workers: 19 },
                { id: '12', name: 'Security Guard', hindiName: 'सिक्योरिटी गार्ड', icon: '🛡️', workers: 72 }
            ];
            LocalStorageDB.professions.set(defaultProfessions);
            return defaultProfessions;
        },
        set: (professions) => {
            localStorage.setItem('labourhub_professions', JSON.stringify(professions));
        }
    }
};

// Export for use in other files
window.LocalStorageDB = LocalStorageDB;
window.firebaseConfig = firebaseConfig;