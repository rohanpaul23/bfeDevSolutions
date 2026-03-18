class LazyManClass {
  constructor(name, logFn) {
    // store name
    this.name = name;

    // store logger function (console.log or custom)
    this.logFn = logFn;

    // queue to store all tasks
    this.tasks = [];

    // -----------------------------
    // First task → greeting
    // We push a function, not run immediately
    // -----------------------------
    this.tasks.push(() => {
      this.logFn(`Hi, I'm ${this.name}.`);

      // after finishing this task, run next one
      this.next();
    });

    // -----------------------------
    // IMPORTANT
    // Start running queue AFTER current call stack
    // so that eat/sleep/sleepFirst can add tasks first
    // -----------------------------
    setTimeout(() => {
      this.next();
    }, 0);
  }

  // -----------------------------
  // Run next task in queue
  // -----------------------------
  next() {
    // remove first task from queue
    const task = this.tasks.shift();

    // run if exists
    if (task) {
      task();
    }
  }

  // -----------------------------
  // eat(food)
  // Add task to END of queue
  // -----------------------------
  eat(food) {
    this.tasks.push(() => {
      this.logFn(`Eat ${food}.`);

      // after eating, continue queue
      this.next();
    });

    // return this for chaining
    return this;
  }

  // -----------------------------
  // sleep(time)
  // Add async task to END of queue
  // -----------------------------
  sleep(time) {
    this.tasks.push(() => {
      // wait for given seconds
      setTimeout(() => {
        this.logFn(
          `Wake up after ${time} second${time > 1 ? "s" : ""}.`
        );

        // continue queue after delay
        this.next();
      }, time * 1000);
    });

    return this;
  }

  // -----------------------------
  // sleepFirst(time)
  // Add async task to FRONT of queue
  // Highest priority
  // -----------------------------
  sleepFirst(time) {
    this.tasks.unshift(() => {
      setTimeout(() => {
        this.logFn(
          `Wake up after ${time} second${time > 1 ? "s" : ""}.`
        );

        // continue queue
        this.next();
      }, time * 1000);
    });

    return this;
  }
}


// -----------------------------
// Factory function
// -----------------------------
function LazyMan(name, logFn) {
  return new LazyManClass(name, logFn);
}