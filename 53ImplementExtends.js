/**
 * myExtends(SuperType, SubType)
 *
 * Goal:
 * Create a new constructor (ExtendedType) that behaves like:
 *
 *   class SubType extends SuperType {}
 *
 * Requirements to satisfy:
 *
 * 1. Instance properties from SuperType
 * 2. Instance properties from SubType
 * 3. Prototype methods from SuperType.prototype
 * 4. Prototype methods from SubType.prototype
 * 5. Static inheritance from SuperType
 * 6. Overridden fields/methods from SubType
 * 7. IMPORTANT: instance.__proto__ === SubType.prototype
 *
 * This last requirement means:
 * 👉 We MUST reuse SubType.prototype directly
 * 👉 We CANNOT create a new prototype object
 */

function myExtends(SuperType, SubType) {

  /**
   * Step 1: Create a new constructor
   *
   * This will act like the "child class constructor"
   */
  function ExtendedType() {

    /**
     * Step 1A: Call SuperType constructor
     *
     * This assigns instance properties from SuperType
     *
     * Example:
     *   this.name = name
     *   this.forSuper = [1,2]
     *   this.from = 'super'
     *
     * Requirement satisfied:
     * ✅ instance properties from SuperType
     */
    SuperType.apply(this, arguments);

    /**
     * Step 1B: Call SubType constructor
     *
     * This adds/overrides instance properties
     *
     * Example:
     *   this.forSub = [3,4]
     *   this.from = 'sub'   // overrides 'super'
     *
     * Requirement satisfied:
     * ✅ instance properties from SubType
     * ✅ overridden fields from SubType
     */
    SubType.apply(this, arguments);
  }

  /**
   * Step 2: Set prototype
   *
   * VERY IMPORTANT:
   *
   * We assign SubType.prototype directly.
   *
   * Why?
   * Because the test requires:
   *
   *   instance.__proto__ === SubType.prototype
   *
   * Normally we'd do:
   *   Object.create(...)
   * but that would break this requirement.
   *
   * Requirement satisfied:
   * ✅ instance.__proto__ === SubType.prototype
   */
  ExtendedType.prototype = SubType.prototype;

  /**
   * Step 3: Link prototype chain
   *
   * We now connect:
   *
   *   SubType.prototype → SuperType.prototype
   *
   * So the full chain becomes:
   *
   *   instance
   *     → SubType.prototype
   *         → SuperType.prototype
   *             → Object.prototype
   *
   * Requirement satisfied:
   * ✅ prototype methods from SuperType.prototype
   * ✅ prototype methods from SubType.prototype
   */
  Object.setPrototypeOf(SubType.prototype, SuperType.prototype);

  /**
   * Step 4: Static inheritance
   *
   * Functions are objects in JS.
   * So constructors can inherit from each other.
   *
   * This sets:
   *
   *   ExtendedType → SuperType
   *
   * So static properties are inherited:
   *
   *   ExtendedType.staticSuper
   *
   * Requirement satisfied:
   * ✅ static inheritance from SuperType
   */
  Object.setPrototypeOf(ExtendedType, SuperType);

  /**
   * Step 5: Return the new constructor
   */
  return ExtendedType;
}