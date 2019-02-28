import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufCol: WebGLBuffer;
  bufUV: WebGLBuffer;

  bufBranchPos:WebGLBuffer;
  bufBranchLook:WebGLBuffer;
  bufBranchUp:WebGLBuffer;
  bufBranchRight:WebGLBuffer;

  bufLPos : WebGLBuffer;

  idxGenerated: boolean = false;
  posGenerated: boolean = false;
  norGenerated: boolean = false;
  colGenerated: boolean = false;
  uvGenerated: boolean = false;

  BposGenerated: boolean = false;
  BlookGenerated: boolean = false;
  BupGenerated:boolean = false;
  BrightGenerated: boolean = false;

  LposGenerated:boolean = false;

  numInstances: number = 0; // How many instances of this Drawable the shader program should draw

  abstract create() : void;

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

  generateBpos(){
    this.BposGenerated = true;
    this.bufBranchPos = gl.createBuffer();
  }

  generateBlook(){
    this.BlookGenerated = true;
    this.bufBranchLook = gl.createBuffer();
  }

  generateBup(){
    this.BupGenerated = true;
    this.bufBranchUp = gl.createBuffer();
  }

  generateBright(){
    this.BrightGenerated = true;
    this.bufBranchRight = gl.createBuffer();
  }

  generateLpos(){
    this.LposGenerated = true;
    this.bufLPos = gl.createBuffer();
  }

  bindIdx(): boolean {
    if (this.idxGenerated) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxGenerated;
  }

  bindPos(): boolean {
    if (this.posGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posGenerated;
  }

  bindNor(): boolean {
    if (this.norGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norGenerated;
  }

  bindCol(): boolean {
    if (this.colGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    }
    return this.colGenerated;
  }

  bindUV(): boolean {
    if (this.uvGenerated) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    }
    return this.uvGenerated;
  }

  bindBpos(): boolean{
    if(this.BposGenerated){
      gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchPos);
    }
    return this.BposGenerated;
  }

  bindBlook(): boolean{
      if(this.BlookGenerated){
          gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchLook);
      }
      return this.BlookGenerated;
  }

  bindBup(): boolean{
      if(this.BupGenerated){
          gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchUp);
      }
      return this.BupGenerated;
  }

  bindBright(): boolean{
      if(this.BrightGenerated){
          gl.bindBuffer(gl.ARRAY_BUFFER,this.bufBranchRight);
      }
      return this.BrightGenerated;
  }

  bindLpos():boolean{
    if(this.LposGenerated){
      gl.bindBuffer(gl.ARRAY_BUFFER,this.bufLPos);
    }
    return this.LposGenerated;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }

  setNumInstances(num: number) {
    this.numInstances = num;
  }
};

export default Drawable;
