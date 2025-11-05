/**
 * AsyncTaskQueue is a concurrency-controlled task runner.
 * It ensures that no more than a specified number of asynchronous tasks
 * are executed in parallel. Additional tasks are queued and processed
 * as running tasks complete.
 */
class AsyncTaskQueue {
  // Maximum number of tasks allowed to run concurrently
  private limit = 0;

  // Current count of tasks running in parallel
  private runningTasks = 0;

  // Queue of pending tasks (each task is a function returning a Promise)
  private pendingQueue: Array<() => Promise<unknown>> = [];

  /**
   * @param concurrency - Maximum number of concurrent async tasks allowed.
   */
  constructor(concurrency: number) {
    this.limit = concurrency;
  }

  /**
   * Adds a new async task to the queue.
   * If the number of running tasks is below the limit, it immediately starts execution.
   * Otherwise, the task waits in the pending queue.
   * 
   * @param task - A function that returns a Promise (representing the async task)
   */
  queue(task: () => Promise<void>) {
    // Add the task to the pending queue
    this.pendingQueue.push(task);

    // Attempt to start execution of the next task if possible
    this.runNextTask();
  }

  /**
   * Checks if a new task can be started based on concurrency limit.
   * If yes, it dequeues and executes the next task from the pending queue.
   * Automatically triggers the next one when a task finishes (success or failure).
   */
  private runNextTask() {
    // Stop if the concurrency limit is reached or if no pending tasks exist
    if (this.runningTasks >= this.limit || this.pendingQueue.length === 0) {
      return;
    }

    // Remove the next task from the queue
    const taskToRun = this.pendingQueue.shift()!;

    // Increment the running task counter
    this.runningTasks++;

    // Execute the task
    taskToRun()
      .then((result) => console.log("Executed task:", result))
      .catch((error) => console.log("Failed task:", error))
      .finally(() => {
        // Decrement the count once the task finishes
        this.runningTasks--;

        // Attempt to run the next queued task
        this.runNextTask();
      });
  }
}
