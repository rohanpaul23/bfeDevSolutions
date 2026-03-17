// Create a wrapper object on window
window.myLocalStorage = {

  // =========================
  // getItem
  // =========================
  getItem(key) {

    // Read raw string from localStorage
    const raw = localStorage.getItem(key);

    // If nothing stored, return null (same as real localStorage)
    if (raw == null) return null;

    // Convert stored JSON string back to object
    const data = JSON.parse(raw);

    // data format:
    // {
    //   value: "...",
    //   expire: number | null
    // }

    // If expire is not null, check expiration
    if (data.expire !== null) {

      // If current time is greater than expire time,
      // the item has expired
      if (Date.now() > data.expire) {

        // Remove expired item from storage
        localStorage.removeItem(key);

        // Return null because item is expired
        return null;
      }
    }

    // Not expired → return stored value
    return data.value;
  },


  // =========================
  // setItem
  // =========================
  setItem(key, value, maxAge) {

    // expire will store timestamp in milliseconds
    let expire = null;

    // IMPORTANT:
    // we must check maxAge !== undefined
    // not just "if (maxAge)"
    //
    // because maxAge = 0 is valid (expire immediately)
    if (maxAge !== undefined) {

      // Date.now() gives current time in ms
      // maxAge is also in ms
      // so expire = now + maxAge
      expire = Date.now() + maxAge;
    }

    // Store object as JSON string
    localStorage.setItem(
      key,
      JSON.stringify({
        value: value,  // actual stored value
        expire: expire // expiration timestamp or null
      })
    );
  },


  // =========================
  // removeItem
  // =========================
  removeItem(key) {

    // Same behavior as real localStorage
    localStorage.removeItem(key);
  },


  // =========================
  // clear
  // =========================
  clear() {

    // Remove all keys
    localStorage.clear();
  }
};