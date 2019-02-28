var CameraControls = require('3d-view-controls');
import { vec3, mat4 } from 'gl-matrix';
class Camera {
    constructor(position, target) {
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.fovy = 45;
        this.aspectRatio = 1;
        this.near = 0.1;
        this.far = 1000;
        this.position = vec3.create();
        this.direction = vec3.create();
        this.target = vec3.create();
        this.up = vec3.create();
        this.right = vec3.create();
        this.forward = vec3.create();
        const canvas = document.getElementById('canvas');
        this.controls = CameraControls(canvas, {
            position: position,
            eye: position,
            center: target,
        });
        vec3.add(this.target, this.position, this.direction);
        mat4.lookAt(this.viewMatrix, this.controls.eye, this.controls.center, this.controls.up);
        this.position = this.controls.eye;
        this.up = this.controls.up;
        vec3.subtract(this.forward, this.target, this.position);
        vec3.normalize(this.forward, this.forward);
        vec3.cross(this.right, this.forward, this.up);
        vec3.normalize(this.right, this.right);
    }
    setAspectRatio(aspectRatio) {
        this.aspectRatio = aspectRatio;
    }
    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fovy, this.aspectRatio, this.near, this.far);
    }
    update() {
        this.controls.tick();
        vec3.add(this.target, this.position, this.direction);
        this.position = vec3.fromValues(this.controls.eye[0], this.controls.eye[1], this.controls.eye[2]);
        this.target = vec3.fromValues(this.controls.center[0], this.controls.center[1], this.controls.center[2]);
        mat4.lookAt(this.viewMatrix, this.controls.eye, this.controls.center, this.controls.up);
        this.position = this.controls.eye;
        this.up = vec3.fromValues(this.controls.up[0], this.controls.up[1], this.controls.up[2]);
        vec3.normalize(this.up, this.up);
        vec3.subtract(this.forward, this.target, this.position);
        vec3.normalize(this.forward, this.forward);
        vec3.cross(this.right, this.forward, this.up);
        vec3.normalize(this.right, this.right);
        vec3.cross(this.up, this.right, this.forward);
        vec3.normalize(this.up, this.up);
    }
}
;
export default Camera;
//# sourceMappingURL=Camera.js.map