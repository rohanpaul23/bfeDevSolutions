class AsyncTaskQueue {
  // Maximum number of tasks allowed to run at the same time
  private concurrency: number;

  // How many tasks are currently running right now
  private runningCount: number;

  // Tasks waiting for their turn
  private taskQueue: Array<() => Promise<void>>;

  constructor(concurrency: number) {
    // Save the concurrency limit
    this.concurrency = concurrency;

    // At the beginning, nothing is running
    this.runningCount = 0;

    // Start with an empty waiting queue
    this.taskQueue = [];
  }

  queue(task: () => Promise<void>) {
    // Add the new task to the waiting queue
    this.taskQueue.push(task);

    // After adding a task, try to start tasks if there is free capacity
    this.runNext();
  }

  private runNext() {
    // -------------------------------
    // Case 1: already running max tasks
    // -------------------------------
    // Example:
    // concurrency = 2
    // runningCount = 2
    // That means no more tasks can start right now
    if (this.runningCount >= this.concurrency) {
      return;
    }

    // -------------------------------
    // Case 2: no waiting tasks
    // -------------------------------
    // Nothing to run, so just stop
    if (this.taskQueue.length === 0) {
      return;
    }

    // -------------------------------
    // Take the next task from the front of the queue
    // -------------------------------
    // shift() removes and returns the first waiting task
    const nextTask = this.taskQueue.shift()!;

    // We are about to start one task,
    // so increase the number of running tasks
    this.runningCount++;

    // -------------------------------
    // Run the task
    // -------------------------------
    // nextTask() returns a Promise<void>
    nextTask()
      .catch(() => {
        // We ignore task errors here so that one failed task
        // does not break the queue logic.
        //
        // Important:
        // Even if the task fails, we still want the queue
        // to continue running later tasks.
      })
      .finally(() => {
        // This block runs whether the task:
        // - resolves successfully
        // - rejects with an error
        //
        // The task is now finished, so free one running slot
        this.runningCount--;

        // Since one slot became free, try to start another waiting task
        this.runNext();
      });

    // -------------------------------
    // Important detail
    // -------------------------------
    // This version starts only one task per runNext() call.
    // That is okay because:
    // - queue() calls runNext() every time a new task is added
    // - finally() calls runNext() again whenever a task finishes
    //
    // So over time, tasks continue to flow correctly.
  }
}