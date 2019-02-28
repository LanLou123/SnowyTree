import {vec3,vec4,mat4} from 'gl-matrix'

export class Turtle{
    pos : vec3;
    up : vec3;
    look : vec3;
    right : vec3;
    depth : number = 0;
    transform : mat4;
    fixsteps : number = 1.3;
    steps:number = 1.3;

    constructor(pos:vec3 = vec3.fromValues(0,0,0),
                up:vec3 = vec3.fromValues(0,1,0),
                look :vec3 = vec3.fromValues(0,0,1),
                right : vec3 = vec3.fromValues(1,0,0)){
        this.pos = pos;
        this.up = up;
        this.look = look;
        this.right = right;
        this.transform = mat4.fromValues(1,0,0,0,
                                        0,1,0,0,
                                        0,0,1,0,
                                        0,0,0,1)
    }

    moveforward(dis:number){
        let oldpos:vec3 = vec3.create();
        vec3.copy(oldpos,this.pos);
        vec3.scaleAndAdd(this.pos,this.pos,this.look,dis);
        let trans:vec3 = vec3.create();
        vec3.sub(trans,oldpos,this.pos);
        let transmat : mat4 = mat4.create();
        mat4.translate(this.transform,this.transform,trans);

        this.depth++;
    }

    rotateAroundUp(deg:number){
        let radian = deg * Math.PI / 180;
        let rot = mat4.create();
        mat4.rotate(rot,rot,radian,this.up);
        mat4.rotate(this.transform,this.transform,radian,this.up);
        vec3.transformMat4(this.look,this.look,rot);
        vec3.transformMat4(this.right,this.right,rot);
    }

    rotateAroundLook(deg:number){
        let radian = deg * Math.PI / 180;
        let rot = mat4.create();
        mat4.rotate(rot,rot,radian,this.look);
        mat4.rotate(this.transform,this.transform,radian,this.look);
        vec3.transformMat4(this.up,this.up,rot);
        vec3.transformMat4(this.right,this.right,rot);
    }

    rotateAroundRight(deg:number){
        let radian = deg * Math.PI / 180;
        let rot = mat4.create();
        mat4.rotate(rot,rot,radian,this.right);
        mat4.rotate(this.transform,this.transform,radian,this.right);
        vec3.transformMat4(this.look,this.look,rot);
        vec3.transformMat4(this.up,this.up,rot);
    }
}