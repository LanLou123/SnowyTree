import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Cylinder extends Drawable {
    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    numDivisions: number;

    branchPos:Float32Array;
    branchLook:Float32Array;
    branchUp:Float32Array;
    branchRight:Float32Array;


    constructor(numDivisions: number) {
        super(); // Call the constructor of the super class. This is required.
        this.numDivisions = numDivisions;
    }

    create() {

        let positions = [];
        let normals = [];
        let indicies = [];
        for(let i = 0; i < this.numDivisions; i++) {
            
            let x = 0.05 * Math.cos(i * 2 * Math.PI / this.numDivisions);
            let z = 0.05 * Math.sin(i * 2 * Math.PI / this.numDivisions);

            positions.push(x, 0.2, z, 1);
            positions.push(x, 0, z, 1);
            normals.push(x,0,z,1);
            normals.push(x,0,z,1);

            let r1 = i*2;
            let r2 = i*2 + 1;
            let r3 = (i*2 + 2) % (this.numDivisions * 2);
            let r4 = (i*2 + 3) % (this.numDivisions * 2);

            indicies.push(r1, r2, r3);
            indicies.push(r2, r3, r4);
        }

        this.indices = new Uint32Array(indicies);
        this.positions = new Float32Array(positions);
        this.normals = new Float32Array(normals);

        this.generateIdx();
        this.generatePos();
        this.generateCol();
        this.generateNor();


        this.generateBpos();
        this.generateBlook();
        this.generateBup();
        this.generateBright();




        this.count = this.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER,this.normals,gl.STATIC_DRAW);


    }

    setInstanceVBOs( branchPos: Float32Array,
                    branchLook: Float32Array, branchUp: Float32Array, branchRight: Float32Array) {


        this.branchPos = new Float32Array(branchPos);
        this.branchLook = new Float32Array(branchLook);
        this.branchUp = new Float32Array(branchUp);
        this.branchRight = new Float32Array(branchRight);



        gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchPos);
        gl.bufferData(gl.ARRAY_BUFFER,this.branchPos,gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchLook);
        gl.bufferData(gl.ARRAY_BUFFER,this.branchLook,gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchUp);
        gl.bufferData(gl.ARRAY_BUFFER,this.branchUp,gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchRight);
        gl.bufferData(gl.ARRAY_BUFFER,this.branchRight,gl.STATIC_DRAW);


    }
};

export default Cylinder;