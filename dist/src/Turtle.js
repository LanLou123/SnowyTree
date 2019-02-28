import { vec3, mat4 } from 'gl-matrix';
export class Turtle {
    constructor(pos = vec3.fromValues(0, 0, 0), up = vec3.fromValues(0, 1, 0), look = vec3.fromValues(0, 0, 1), right = vec3.fromValues(1, 0, 0)) {
        this.depth = 0;
        this.fixsteps = 1.3;
        this.steps = 1.3;
        this.pos = pos;
        this.up = up;
        this.look = look;
        this.right = right;
        this.transform = mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    moveforward(dis) {
        let oldpos = vec3.create();
        vec3.copy(oldpos, this.pos);
        vec3.scaleAndAdd(this.pos, this.pos, this.look, dis);
        let trans = vec3.create();
        vec3.sub(trans, oldpos, this.pos);
        let transmat = mat4.create();
        mat4.translate(this.transform, this.transform, trans);
        this.depth++;
    }
    rotateAroundUp(deg) {
        let radian = deg * Math.PI / 180;
        let rot = mat4.create();
        mat4.rotate(rot, rot, radian, this.up);
        mat4.rotate(this.transform, this.transform, radian, this.up);
        vec3.transformMat4(this.look, this.look, rot);
        vec3.transformMat4(this.right, this.right, rot);
    }
    rotateAroundLook(deg) {
        let radian = deg * Math.PI / 180;
        let rot = mat4.create();
        mat4.rotate(rot, rot, radian, this.look);
        mat4.rotate(this.transform, this.transform, radian, this.look);
        vec3.transformMat4(this.up, this.up, rot);
        vec3.transformMat4(this.right, this.right, rot);
    }
    rotateAroundRight(deg) {
        let radian = deg * Math.PI / 180;
        let rot = mat4.create();
        mat4.rotate(rot, rot, radian, this.right);
        mat4.rotate(this.transform, this.transform, radian, this.right);
        vec3.transformMat4(this.look, this.look, rot);
        vec3.transformMat4(this.up, this.up, rot);
    }
}
//# sourceMappingURL=Turtle.js.map