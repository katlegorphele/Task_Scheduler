import { AxiosError } from 'axios';
import axios from 'axios';
import * as readline from 'readline';

// GET PORT FROM ENV
const PORT = process.env.PORT || 4000;

const baseUrl = `http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4000`;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Define types for task and task creation data
interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    createdAt: Date;
    updatedAt: Date | null;
    completed: boolean;
}

interface CreateTaskData {
    title: string;
    description: string;
    dueDate: string;
}

// Function to fetch all tasks
async function getAllTasks() {
    try {
        const response = await axios.get<Task[]>(`${baseUrl}/tasks`);
        console.log('All tasks:', response.data);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Error fetching all tasks:', axiosError.response?.data || axiosError.message);
    }
}

// Function to create a new task
async function createTask() {
    rl.question('Enter task title: ', async (title) => {
        rl.question('Enter task description: ', async (description) => {
            rl.question('Enter due date (YYYY-MM-DD): ', async (dueDate) => {
                try {
                    const taskData: CreateTaskData = { title, description, dueDate };
                    const response = await axios.post<Task>(`${baseUrl}/tasks`, taskData);
                    console.log('Created task:', response.data);
                } catch (error) {
                    const axiosError = error as AxiosError;
                    console.error('Error creating task:', axiosError.response?.data || axiosError.message);
                } finally {
                    rl.close();
                }
            });
        });
    });
}

// Function to search tasks by title
async function searchTasksByTitle() {
    rl.question('Enter task title to search: ', async (title) => {
        try {
            const response = await axios.get<Task[]>(`${baseUrl}/tasks/search/${title}`);
            console.log(`Tasks with title '${title}':`, response.data);
        } catch (error: any) {
            console.error(`Error searching tasks with title '${title}':`, error.response?.data || error.message);
        } finally {
            rl.close();
        }
    });
}

// Interactive menu
function startMenu() {
    console.log('Choose an option:');
    console.log('1. Fetch all tasks');
    console.log('2. Create a new task');
    console.log('3. Search tasks by title');
    console.log('4. Exit');
    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
            case '1':
                getAllTasks().then(startMenu);
                break;
            case '2':
                createTask().then(startMenu);
                break;
            case '3':
                searchTasksByTitle().then(startMenu);
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please enter a number between 1 and 4.');
                startMenu();
                break;
        }
    });
}

// Start the interactive menu
startMenu();

