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

const taskFinder = (id: string) => {
    return tasksStorage.get(id);
};

export default Server(() => {
    const app = express();
    app.use(express.json());

    app.post("/tasks", (req: Request, res: Response) => {
        const task: Task = { id: uuidv4(), createdAt: getCurrentDate(), ...req.body, updatedAt: null, completed: false };
        tasksStorage.insert(task.id, task);
        return res.status(201).json(task);
    });

    app.get("/tasks", (req: Request, res: Response) => {
        return res.status(200).json(tasksStorage.values());
    });

    app.get("/tasks/:id", (req: Request, res: Response) => {
        const taskId = req.params.id;
        const taskOpt = taskFinder(taskId);
        if ("None" in taskOpt) {
            return res.status(404).send(`The task with id=${taskId} not found`);
        } else {
            return res.status(200).json(taskOpt.Some);
        }
    });

    app.put("/tasks/:id", (req: Request, res: Response) => {
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

    app.delete("/tasks/:id", (req: Request, res: Response) => {
        const taskId = req.params.id;
        const deletedTask = tasksStorage.remove(taskId);
        if ("None" in deletedTask) {
            return res.status(400).send(`Couldn't delete the task with id=${taskId}. Task not found`);
        } else {
            return res.status(200).json(deletedTask.Some);
        }
    });

    const PORT = 4000;
    return app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

function getCurrentDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}
