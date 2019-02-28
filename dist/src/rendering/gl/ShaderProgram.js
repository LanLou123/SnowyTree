import { mat4 } from 'gl-matrix';
import { gl } from '../../globals';
var activeProgram = null;
export class Shader {
    constructor(type, source) {
        this.shader = gl.createShader(type);
        gl.shaderSource(this.shader, source);
        gl.compileShader(this.shader);
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            throw gl.getShaderInfoLog(this.shader);
        }
    }
}
;
class ShaderProgram {
    constructor(shaders) {
        this.attrCol = -1;
        this.prog = gl.createProgram();
        for (let shader of shaders) {
            gl.attachShader(this.prog, shader.shader);
        }
        gl.linkProgram(this.prog);
        if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
            throw gl.getProgramInfoLog(this.prog);
        }
        this.attrPos = gl.getAttribLocation(this.prog, "vs_Pos");
        this.attrNor = gl.getAttribLocation(this.prog, "vs_Nor");
        this.attrUV = gl.getAttribLocation(this.prog, "vs_UV");
        this.attrBpos = gl.getAttribLocation(this.prog, "vs_Bpos");
        this.attrBlook = gl.getAttribLocation(this.prog, "vs_Blook");
        this.attrBup = gl.getAttribLocation(this.prog, "vs_Bup");
        this.attrBright = gl.getAttribLocation(this.prog, "vs_Bright");
        this.attrLpos = gl.getAttribLocation(this.prog, "vs_Lpos");
        this.unifModel = gl.getUniformLocation(this.prog, "u_Model");
        this.unifModelInvTr = gl.getUniformLocation(this.prog, "u_ModelInvTr");
        this.unifViewProj = gl.getUniformLocation(this.prog, "u_ViewProj");
        this.unifCameraAxes = gl.getUniformLocation(this.prog, "u_CameraAxes");
        this.unifTime = gl.getUniformLocation(this.prog, "u_Time");
        this.unifEye = gl.getUniformLocation(this.prog, "u_Eye");
        this.unifRef = gl.getUniformLocation(this.prog, "u_Ref");
        this.unifUp = gl.getUniformLocation(this.prog, "u_Up");
        this.unifDimensions = gl.getUniformLocation(this.prog, "u_Dimensions");
    }
    use() {
        if (activeProgram !== this.prog) {
            gl.useProgram(this.prog);
            activeProgram = this.prog;
        }
    }
    setEyeRefUp(eye, ref, up) {
        this.use();
        if (this.unifEye !== -1) {
            gl.uniform3f(this.unifEye, eye[0], eye[1], eye[2]);
        }
        if (this.unifRef !== -1) {
            gl.uniform3f(this.unifRef, ref[0], ref[1], ref[2]);
        }
        if (this.unifUp !== -1) {
            gl.uniform3f(this.unifUp, up[0], up[1], up[2]);
        }
    }
    setDimensions(width, height) {
        this.use();
        if (this.unifDimensions !== -1) {
            gl.uniform2f(this.unifDimensions, width, height);
        }
    }
    setModelMatrix(model) {
        this.use();
        if (this.unifModel !== -1) {
            gl.uniformMatrix4fv(this.unifModel, false, model);
        }
        if (this.unifModelInvTr !== -1) {
            let modelinvtr = mat4.create();
            mat4.transpose(modelinvtr, model);
            mat4.invert(modelinvtr, modelinvtr);
            gl.uniformMatrix4fv(this.unifModelInvTr, false, modelinvtr);
        }
    }
    setViewProjMatrix(vp) {
        this.use();
        if (this.unifViewProj !== -1) {
            gl.uniformMatrix4fv(this.unifViewProj, false, vp);
        }
    }
    setCameraAxes(axes) {
        this.use();
        if (this.unifCameraAxes !== -1) {
            gl.uniformMatrix3fv(this.unifCameraAxes, false, axes);
        }
    }
    setTime(t) {
        this.use();
        if (this.unifTime !== -1) {
            gl.uniform1f(this.unifTime, t);
        }
    }
    draw(d) {
        this.use();
        if (this.attrPos != -1 && d.bindPos()) {
            gl.enableVertexAttribArray(this.attrPos);
            gl.vertexAttribPointer(this.attrPos, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrPos, 0); // Advance 1 index in pos VBO for each vertex
        }
        if (this.attrNor != -1 && d.bindNor()) {
            gl.enableVertexAttribArray(this.attrNor);
            gl.vertexAttribPointer(this.attrNor, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrNor, 0); // Advance 1 index in nor VBO for each vertex
        }
        if (this.attrCol != -1 && d.bindCol()) {
            gl.enableVertexAttribArray(this.attrCol);
            gl.vertexAttribPointer(this.attrCol, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrCol, 1); // Advance 1 index in col VBO for each drawn instance
        }
        if (this.attrUV != -1 && d.bindUV()) {
            gl.enableVertexAttribArray(this.attrUV);
            gl.vertexAttribPointer(this.attrUV, 2, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrUV, 0); // Advance 1 index in pos VBO for each vertex
        }
        if (this.attrBpos != -1 && d.bindBpos()) {
            gl.enableVertexAttribArray(this.attrBpos);
            gl.vertexAttribPointer(this.attrBpos, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrBpos, 1); // Advance 1 index in translate VBO for each drawn instance
        }
        if (this.attrBlook != -1 && d.bindBlook()) {
            gl.enableVertexAttribArray(this.attrBlook);
            gl.vertexAttribPointer(this.attrBlook, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrBlook, 1); // Advance 1 index in translate VBO for each drawn instance
        }
        if (this.attrBup != -1 && d.bindBup()) {
            gl.enableVertexAttribArray(this.attrBup);
            gl.vertexAttribPointer(this.attrBup, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrBup, 1); // Advance 1 index in translate VBO for each drawn instance
        }
        if (this.attrBright != -1 && d.bindBright()) {
            gl.enableVertexAttribArray(this.attrBright);
            gl.vertexAttribPointer(this.attrBright, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrBright, 1); // Advance 1 index in translate VBO for each drawn instance
        }
        if (this.attrLpos != -1 && d.bindLpos()) {
            gl.enableVertexAttribArray(this.attrLpos);
            gl.vertexAttribPointer(this.attrLpos, 3, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(this.attrLpos, 1);
        }
        // TODO: Set up attribute data for additional instanced rendering data as needed
        d.bindIdx();
        // drawElementsInstanced uses the vertexAttribDivisor for each "in" variable to
        // determine how to link it to each drawn instance of the bound VBO.
        // For example, the index used to look in the VBO associated with
        // vs_Pos (attrPos) is advanced by 1 for each thread of the GPU running the
        // vertex shader since its divisor is 0.
        // On the other hand, the index used to look in the VBO associated with
        // vs_Translate (attrTranslate) is advanced by 1 only when the next instance
        // of our drawn object (in the base code example, the square) is processed
        // by the GPU, thus being the same value for the first set of four vertices,
        // then advancing to a new value for the next four, then the next four, and
        // so on.
        gl.drawElementsInstanced(d.drawMode(), d.elemCount(), gl.UNSIGNED_INT, 0, d.numInstances);
        if (this.attrPos != -1)
            gl.disableVertexAttribArray(this.attrPos);
        if (this.attrNor != -1)
            gl.disableVertexAttribArray(this.attrNor);
        if (this.attrCol != -1)
            gl.disableVertexAttribArray(this.attrCol);
        if (this.attrUV != -1)
            gl.disableVertexAttribArray(this.attrUV);
        if (this.attrBpos != -1)
            gl.disableVertexAttribArray(this.attrBpos);
        if (this.attrBlook != -1)
            gl.disableVertexAttribArray(this.attrBlook);
        if (this.attrBright != -1)
            gl.disableVertexAttribArray(this.attrBright);
        if (this.attrBup != -1)
            gl.disableVertexAttribArray(this.attrBup);
        if (this.attrLpos != -1)
            gl.disableVertexAttribArray(this.attrLpos);
    }
}
;
export default ShaderProgram;
//# sourceMappingURL=ShaderProgram.js.map