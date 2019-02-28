import Drawable from '../rendering/gl/Drawable';
import { gl } from '../globals';
class Square extends Drawable {
    constructor(len) {
        super(); // Call the constructor of the super class. This is required.
        this.len = 10;
        this.len = len;
    }
    create() {
        this.indices = new Uint32Array([0, 1, 2,
            0, 2, 3]);
        this.positions = new Float32Array([-this.len, 0, -this.len, 1,
            this.len, 0, -this.len, 1,
            this.len, 0, this.len, 1,
            -this.len, 0, this.len, 1]);
        this.generateIdx();
        this.generatePos();
        this.generateCol();
        this.count = this.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        console.log(`Created square`);
    }
    setInstanceVBOs(offsets, colors) {
        this.colors = colors;
        this.offsets = offsets;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    }
}
;
export default Square;
//# sourceMappingURL=Square.js.map