/**
 * Implements first-person pointer lock controls for 3D navigation.
 * Provides camera control using mouse movement when pointer lock is active.
 * Based on THREE.PointerLockControls with custom modifications.
 * @class
 * @param {THREE.Camera} camera - Three.js camera to be controlled
 * @param {HTMLElement} domElement - DOM element used for pointer lock requests
*/

var PointerLockControls = function (camera, domElement) {
    var scope = this;

    camera.rotation.set(0, 0, 0);

    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add(pitchObject);

    var PI_2 = Math.PI / 2;

    var onMouseMove = function (event) {
        if (scope.isLocked === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;
        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    };

    var onPointerlockChange = function () {
        scope.isLocked = document.pointerLockElement === domElement;
    };

    var onPointerlockError = function () {
        console.error('PointerLockControls: Unable to use Pointer Lock API');
    };

    /**
       * Connects event listeners for pointer lock controls.
       * Should be called during initialization.
       * @method
    */
    this.connect = function () {
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('pointerlockchange', onPointerlockChange, false);
        document.addEventListener('pointerlockerror', onPointerlockError, false);
    };

    /**
       * Disconnects event listeners for pointer lock controls.
       * Used for cleanup to prevent memory leaks.
       * @method
    */
    this.disconnect = function () {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('pointerlockchange', onPointerlockChange, false);
        document.removeEventListener('pointerlockerror', onPointerlockError, false);
    };

    /**
       * Cleans up resources and disconnects event listeners.
       * @method
    */
    this.dispose = function () {
        this.disconnect();
    };

    /**
       * Gets the root object (yawObject) containing the camera hierarchy.
       * This object should be added to the scene.
       * @method
       * @returns {THREE.Object3D} Root object of the control system
    */
    this.getObject = function () {
        return yawObject;
    };

    /**
       * Requests pointer lock on the specified DOM element.
       * Activates first-person controls when successful.
       * @method
    */
    this.lock = function () {
        domElement.requestPointerLock();
    };

    /**
       * Exits pointer lock mode.
       * Deactivates first-person controls.
       * @method
    */
    this.unlock = function () {
        document.exitPointerLock();
    };

    /**
       * Indicates whether pointer lock is currently active.
       * @member {boolean}
    */
    this.isLocked = false;

    // Initialize controls
    this.connect();
};
