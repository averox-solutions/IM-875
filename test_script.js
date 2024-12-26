const fetch = require('node-fetch');  // Import node-fetch to use fetch in Node.js

const API_BASE_URL = 'https://1cb9-182-180-55-138.ngrok-free.app';  // Your server URL
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTI5Njg1MDRmMjEzZWJmZDVmYjAyYyIsImVtYWlsIjoiYmV0YUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJldGEiLCJpYXQiOjE3MzM0NzAyNDMsImV4cCI6MTczMzU1NjY0M30.Una-RxTU2Ff8p9yUM3XwjPDHqIdukfwlmnkBz4v2RPY';  // Replace this with the correct token

// Helper function to make a fetch request with proper headers
const fetchData = async (url) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
    };

    const options = {
        method: 'GET',  // 'GET' for fetching data
        headers,
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error fetching data');
        }

        return data;  // Return the fetched data
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// 3. Test getting all chats
const getAllChats = async () => {
    const url = `${API_BASE_URL}/im/chatrooms`;  // The endpoint for getting all chats
    try {
        const data = await fetchData(url);
        console.log('All Chats:', data);
    } catch (error) {
        console.error('Error fetching all chats:', error);
    }
};

// Call the function to test fetching all chats
getAllChats();
