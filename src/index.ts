import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express, { Request, Response } from 'express';

/**
 * `tasksStorage` - key-value data structure used to store tasks.
 * {@link StableBTreeMap} is a self-balancing tree that acts as a durable data storage that keeps data across canister upgrades.
 *
 * Breakdown of the `StableBTreeMap<string, Task>` data structure:
 * - the key of the map is a `taskId`
 * - the value in this map is a task itself `Task` that is related to a given key (`taskId`)
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map.
 */

/**
 * This type represents a task in the scheduler.
 */
class Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date | null;
    completed: boolean;
}

const tasksStorage = StableBTreeMap<string, Task>(0);

// Helper function to find a task by id
const taskFinder = (id: string) => {
    return tasksStorage.get(id);
};

export default Server(() => {
    const app = express();
    app.use(express.json());

    // Endpoints

    // Endpoint to create a new task
    app.post("/tasks", (req: Request, res: Response) => {
        const task: Task = { id: uuidv4(), createdAt: getCurrentDate(), ...req.body, updatedAt: null, completed: false };
        tasksStorage.insert(task.id, task);
        return res.status(201).json(task);
    });

    // Endpoint to get all tasks
    app.get("/tasks", (req: Request, res: Response) => {
        return res.status(200).json(tasksStorage.values());
    });

    // Endpoint to get a task by id
    app.get("/tasks/:id", (req: Request, res: Response) => {
        const taskId = req.params.id;
        const taskOpt = taskFinder(taskId);
        if ("None" in taskOpt) {
            return res.status(404).send(`The task with id=${taskId} not found`);
        } else {
            return res.status(200).json(taskOpt.Some);
        }
    });


    // Endpoint to update a task by id
    app.put("/tasks/update/:id", (req: Request, res: Response) => {
        const taskId = req.params.id;
        const taskOpt = taskFinder(taskId);
        if ("None" in taskOpt) {
            return res.status(400).send(`Couldn't update the task with id=${taskId}. Task not found`);
        } else {
            const task = taskOpt.Some;
            const updatedTask = { ...task, ...req.body, updatedAt: getCurrentDate() };
            tasksStorage.insert(task.id, updatedTask);
            return res.status(200).json(updatedTask);
        }
    });

    // Endpoint to delete a task by id
    app.delete("/tasks/delete/:id", (req: Request, res: Response) => {
        const taskId = req.params.id;
        const deletedTask = tasksStorage.remove(taskId);
        if ("None" in deletedTask) {
            return res.status(400).send(`Couldn't delete the task with id=${taskId}. Task not found`);
        } else {
            return res.status(200).json(deletedTask.Some);
        }
    });

    // Endpoint to search tasks by title
    app.get("/tasks/search/:title", (req: Request, res: Response) => {
        const title = req.params.title;
        const tasks = tasksStorage.values().filter(task => task.title.toLowerCase().includes(title.toLowerCase()));
    
        if (tasks.length === 0) {
            return res.status(404).json({ error: `No tasks found with title '${title}'` });
        } else {
            return res.status(200).json(tasks);
        }
    });

    // Endpoint to mark a task as completed
    app.put("/tasks/complete/:id", (req: Request, res: Response) => {
        const taskId = req.params.id;
        const taskOpt = taskFinder(taskId);
        if ("None" in taskOpt) {
            return res.status(400).send(`Couldn't update the task with id=${taskId}. Task not found`);
        } else {
            const task = taskOpt.Some;
            const updatedTask = { ...task, completed: true, updatedAt: getCurrentDate() };
            tasksStorage.insert(task.id, updatedTask);
            return res.status(200).json(updatedTask);
        }
    });

    // Endpoint to mark a task as incomplete
    app.put("/tasks/incomplete/:id", (req: Request, res: Response) => {
        const taskId = req.params.id;
        const taskOpt = taskFinder(taskId);
        if ("None" in taskOpt) {
            return res.status(400).send(`Couldn't update the task with id=${taskId}. Task not found`);
        } else {
            const task = taskOpt.Some;
            const updatedTask = { ...task, completed: false, updatedAt: getCurrentDate() };
            tasksStorage.insert(task.id, updatedTask);
            return res.status(200).json(updatedTask);
        }
    });

    // Endpoint to get all completed tasks
    app.get("/tasks/completed", (req: Request, res: Response) => {
        const tasks = tasksStorage.values().filter(task => task.completed);
        return res.status(200).json(tasks);
    });

    // Endpoint to get all incomplete tasks
    app.get("/tasks/incomplete", (req: Request, res: Response) => {
        const tasks = tasksStorage.values().filter(task => !task.completed);
        return res.status(200).json(tasks);
    });


    // Endpoint to get all tasks due on a specific date
    app.get("/tasks/due/:date", (req: Request, res: Response) => {
        const dueDateString = req.params.date;
        const dueDate = new Date(dueDateString);
        if (isNaN(dueDate.getTime())) {
            return res.status(400).send('Invalid date format. Please use YYYY-MM-DD');
        }
        const tasks = tasksStorage.values().filter(task => task.dueDate.toDateString() === dueDate.toDateString());
        return res.status(200).json(tasks);
    });

    // Endpoint to get tasks in a specific date range
    app.get("/tasks/due/:startDate/:endDate", (req: Request, res: Response) => {
        const startDateString = req.params.startDate;
        const endDateString = req.params.endDate;
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).send('Invalid date format. Please use YYYY-MM-DD');
        }
        const tasks = tasksStorage.values().filter(task => task.dueDate >= startDate && task.dueDate <= endDate);
        return res.status(200).json(tasks);
    });
    
  
    // Start the server    
    const PORT = 4000;
    return app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// Helper function to get the current date
function getCurrentDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}
