/**
 * ============================================================
 * Delegated onClick() — jQuery-like event delegation
 * ============================================================
 *
 * GOAL
 * ----
 * Create a function similar to jQuery.on('click', selector, handler),
 * but instead of a selector string, we use a predicate function:
 *
 *   (el: HTMLElement) => boolean
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Stop further propagation of the current event in the capturing phase.
 * NOTE: This is a modified version of the original `stopPropagation` method.
 * The original method will be called after setting the `propagationStopped` flag to true.
/*******  c5c5e9ab-f52a-42b5-98b4-8663b0acc350  *******/ *
//  * The function must:
//  * 1. Attach ONLY ONE real DOM click listener to the root element
//  * 2. Support multiple delegated handlers registered over time
//  * 3. Walk up the DOM tree manually (event delegation)
//  * 4. Call handlers with `this` bound to the matched element
//  * 5. Respect:
//  *    - event.stopPropagation()
//  *    - event.stopImmediatePropagation()
//  *
//  * HOW IT WORKS
//  * ------------
//  * - On the first call, we attach a single "dispatcher" click listener to `root`
//  * - We store all delegated handlers in an array on `root`
//  * - When a click occurs:
//  *     • Start from event.target
//  *     • Walk upward toward `root`
//  *     • For each element, run all predicates
//  *     • If predicate(el) === true, call handler with `this = el`
//  * - We patch the event object to track propagation flags so we can
//  *   stop delegation manually (just like jQuery does internally)
//  *
//  * NOTE
//  * ----
//  * This is classic EVENT DELEGATION and avoids attaching many listeners.
//  */

// 1️⃣ event.stopPropagation()
// What it does

// Stops the event from bubbling to parent elements,
// but does NOT stop other handlers on the same element.

// Effect

// ❌ No bubbling to parent

// ✅ Remaining listeners on the same element still run

// 2️⃣ event.stopImmediatePropagation()
// What it does

// Stops everything immediately:

// No bubbling to parent elements

// No other listeners on the same element

// Effect

// ❌ No bubbling

// ❌ No remaining handlers on the same element


/**
 * @param {HTMLElement} root
 * @param {(el: HTMLElement) => boolean} predicate
 * @param {(e: Event) => void} handler
 */
function onClick(root, predicate, handler) {
  // ------------------------------------------------------------
  // 1️⃣ Install the delegated event system ONCE per root
  // ------------------------------------------------------------
  if (!root.__delegatedClickHandlers) {
    // Store all delegated handlers on the root element
    root.__delegatedClickHandlers = [];

    // Attach exactly ONE real DOM click listener
    root.addEventListener("click", function (event) {
      // --------------------------------------------------------
      // 2️⃣ Patch the event to track propagation state
      // --------------------------------------------------------
      let propagationStopped = false;
      let immediateStopped = false;

      // Save original methods
      const originalStopPropagation = event.stopPropagation;
      const originalStopImmediate = event.stopImmediatePropagation;

      // Override stopPropagation
      event.stopPropagation = function () {
        propagationStopped = true;
        return originalStopPropagation.call(event);
      };

      // Override stopImmediatePropagation
      event.stopImmediatePropagation = function () {
        immediateStopped = true;
        propagationStopped = true;
        return originalStopImmediate.call(event);
      };

      // --------------------------------------------------------
      // 3️⃣ Manually bubble from target → root
      // --------------------------------------------------------
      let current = event.target;

      while (current && current instanceof HTMLElement) {
        // ----------------------------------------------------
        // 4️⃣ Run ALL registered delegated handlers
        // ----------------------------------------------------
        for (const entry of root.__delegatedClickHandlers) {
          // stopImmediatePropagation(): stop everything instantly
          if (immediateStopped) return;

          // If predicate matches, call handler
          if (entry.predicate(current)) {
            // `this` must be the matched element
            entry.handler.call(current, event);
          }
        }

        // stopPropagation(): stop bubbling to parent elements
        if (propagationStopped) return;

        // Stop once the root element has been processed
        if (current === root) return;

        // ----------------------------------------------------
        // 5️⃣ Move up the DOM tree
        // ----------------------------------------------------
        current = current.parentElement;
      }
    });
  }

  // ------------------------------------------------------------
  // 6️⃣ Register the delegated handler
  // ------------------------------------------------------------
  root.__delegatedClickHandlers.push({ predicate, handler });
}
