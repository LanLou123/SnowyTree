import { gl } from '../../globals';
class Drawable {
    constructor() {
        this.count = 0;
        this.idxGenerated = false;
        this.posGenerated = false;
        this.norGenerated = false;
        this.colGenerated = false;
        this.uvGenerated = false;
        this.BposGenerated = false;
        this.BlookGenerated = false;
        this.BupGenerated = false;
        this.BrightGenerated = false;
        this.LposGenerated = false;
        this.numInstances = 0; // How many instances of this Drawable the shader program should draw
    }
    destory() {
        gl.deleteBuffer(this.bufIdx);
        gl.deleteBuffer(this.bufPos);
        gl.deleteBuffer(this.bufNor);
        gl.deleteBuffer(this.bufCol);
        gl.deleteBuffer(this.bufUV);
        gl.deleteBuffer(this.bufBranchPos);
        gl.deleteBuffer(this.bufBranchLook);
        gl.deleteBuffer(this.bufBranchRight);
        gl.deleteBuffer(this.bufBranchUp);
        gl.deleteBuffer(this.bufLPos);
    }
    generateIdx() {
        this.idxGenerated = true;
        this.bufIdx = gl.createBuffer();
    }
    generatePos() {
        this.posGenerated = true;
        this.bufPos = gl.createBuffer();
    }
    generateNor() {
        this.norGenerated = true;
        this.bufNor = gl.createBuffer();
    }
    generateCol() {
        this.colGenerated = true;
        this.bufCol = gl.createBuffer();
    }
    generateUV() {
        this.uvGenerated = true;
        this.bufUV = gl.createBuffer();
    }
    generateBpos() {
        this.BposGenerated = true;
        this.bufBranchPos = gl.createBuffer();
    }
    generateBlook() {
        this.BlookGenerated = true;
        this.bufBranchLook = gl.createBuffer();
    }
    generateBup() {
        this.BupGenerated = true;
        this.bufBranchUp = gl.createBuffer();
    }
    generateBright() {
        this.BrightGenerated = true;
        this.bufBranchRight = gl.createBuffer();
    }
    generateLpos() {
        this.LposGenerated = true;
        this.bufLPos = gl.createBuffer();
    }
    bindIdx() {
        if (this.idxGenerated) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        }
        return this.idxGenerated;
    }
    bindPos() {
        if (this.posGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        }
        return this.posGenerated;
    }
    bindNor() {
        if (this.norGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        }
        return this.norGenerated;
    }
    bindCol() {
        if (this.colGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
        }
        return this.colGenerated;
    }
    bindUV() {
        if (this.uvGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
        }
        return this.uvGenerated;
    }
    bindBpos() {
        if (this.BposGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufBranchPos);
        }
        return this.BposGenerated;
    }
    bindBlook() {
        if (this.BlookGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufBranchLook);
        }
        return this.BlookGenerated;
    }
    bindBup() {
        if (this.BupGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufBranchUp);
        }
        return this.BupGenerated;
    }
    bindBright() {
        if (this.BrightGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufBranchRight);
        }
        return this.BrightGenerated;
    }
    bindLpos() {
        if (this.LposGenerated) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufLPos);
        }
        return this.LposGenerated;
    }
    elemCount() {
        return this.count;
    }
    drawMode() {
        return gl.TRIANGLES;
    }
    setNumInstances(num) {
        this.numInstances = num;
    }
}
;
export default Drawable;
//# sourceMappingURL=Drawable.js.map