import {vec3, quat, vec4, mat4, vec2} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import Plane from './geometry/plane';
import ScreenQuad from './geometry/ScreenQuad';
import Mesh from './geometry/Mesh'
import Cylinder from './geometry/cylinder'
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {Lsystem,Branch,Node} from'./Lsystem'
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile} from './globals';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  NumSnowFlakes : 6000,
  LsystemAngle : 18,
  LsystemStepsize : 0.2,
  'Load Scene' :loadScene,
};


let screenQuad: ScreenQuad;
let time: number = 0.0;
let cylinder : Cylinder;
let plane : Plane;

let Leaf : Mesh;
let snow : Square;
let myL : Lsystem;

let g0 : string = 'FFFA';
let g1 : string = 'A->/F[&&FFA]L///[&&FFA]///[&FFA]/////[&FF*LA]';
let g2 : string = 'F->!^S//F';
let g3 : string = 'S->FL';
let g4 : string = 'L->[^^-/+f|-f+f+f]';
let g5 : string = 'M->[//^^&ff-ff-]'

let str = g0+'\n'+g1+'\n'+g2+'\n'+g3+'\n'+g4+'\n'+g5+'\n' ;

function loadScene() {



  plane = new Plane(vec3.fromValues(0,0,0), vec2.fromValues(450,450), 20);
  plane.create();
  snow = new Square(0.7);
  snow.create();

  let snowNum = controls.NumSnowFlakes;
  let snowPosArray = [];
  for(let i = 0;i<snowNum;i++){
    let rnd1 = 450*(Math.random()-0.5);
    let rnd2 = 300*Math.random();
    let rnd3 = 450*(Math.random()-0.5);
    snowPosArray.push(rnd1);
    snowPosArray.push(rnd2);
    snowPosArray.push(rnd3);

  }
  let snowPos:Float32Array = new Float32Array(snowPosArray);
  snow.setInstanceVBOs(snowPos);
  snow.setNumInstances(snowNum);

  plane.setNumInstances(1);
  screenQuad = new ScreenQuad();
  screenQuad.create();
  cylinder = new Cylinder(10,controls.LsystemStepsize);//new Mesh("./obj/cylinder.obj",vec3.fromValues(0,0,0));
  cylinder.create();
  myL = new Lsystem();
  myL.setAngle(controls.LsystemAngle);
  myL.setStepSize(controls.LsystemStepsize);
  myL.readString(str);
  myL.doThings(7);
  // Set up instanced rendering data arrays here.
  // This example creates a set of positional
  // offsets and gradiated colors for a 100x100 grid
  // of squares, even though the VBO data for just
  // one square is actually passed to the GPU

  let BranchPosArray = [];
  let BranchLookArray = [];
  let BranchupArray = [];
  let BranchRightArray = [];
  let LeafPosArray = [];

  let obj0: string = readTextFile('./obj/leaf.obj')
  Leaf = new Mesh(obj0,vec3.fromValues(0,0,0));
  Leaf.create();

  for(let i = 0;i<myL.NodeList.length;i++){
    let pos:vec3 = vec3.create();
    vec3.copy(pos,myL.NodeList[i].pos);
    LeafPosArray.push(pos[0]);
    LeafPosArray.push(pos[1]);
    LeafPosArray.push(pos[2]);
  }

  let LeafPos:Float32Array = new Float32Array(LeafPosArray);
  Leaf.setInstanceVBOs(LeafPos);
  Leaf.setNumInstances(myL.NodeList.length);

  for(let i = 0;i<myL.BranchList.length;i++){

    let rotq = quat.create();
    let dir = vec3.create();

    vec3.subtract(dir,myL.BranchList[i].end,myL.BranchList[i].start);
    let len = vec3.create();
    vec3.subtract(len,myL.BranchList[i].end,myL.BranchList[i].start);
    let curlen = vec3.length(len);

    let dis = myL.BranchList[i].depth;

    dis = (myL.maxdp-dis-1)/6;


    vec3.normalize(dir,dir);
    quat.rotationTo(rotq,vec3.fromValues(0,1,0),dir);
    let rotmat = mat4.create();
    mat4.fromQuat(rotmat,rotq);
    let transmat = mat4.create();
    mat4.fromTranslation(transmat,myL.BranchList[i].start);

    let sc = curlen/myL.StepSize;

    let model = mat4.fromValues(1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1);
    mat4.scale(model,model,[dis,sc,dis]);
    mat4.multiply(model,rotmat,model);
    mat4.multiply(model,transmat,model);

    BranchPosArray.push(model[0]);
    BranchPosArray.push(model[1]);
    BranchPosArray.push(model[2]);
    BranchPosArray.push(model[3]);


    BranchLookArray.push(model[4]);
    BranchLookArray.push(model[5]);
    BranchLookArray.push(model[6]);
    BranchLookArray.push(model[7]);

    BranchupArray.push(model[8]);
    BranchupArray.push(model[9]);
    BranchupArray.push(model[10]);
    BranchupArray.push(model[11]);

    BranchRightArray.push(model[12]);
    BranchRightArray.push(model[13]);
    BranchRightArray.push(model[14]);
    BranchRightArray.push(model[15]);
  }


  let BranchPos:Float32Array = new Float32Array(BranchPosArray);
  let BranchLook: Float32Array = new Float32Array(BranchLookArray);
  let BranchUp: Float32Array = new Float32Array(BranchupArray);
  let BranchRight: Float32Array = new Float32Array(BranchRightArray);

  cylinder.setInstanceVBOs(BranchPos,BranchLook,BranchUp,BranchRight);
  cylinder.setNumInstances(myL.BranchList.length); // grid of "particles"
}

function _createFBO(gl :WebGL2RenderingContext ) {
    var frame_buffer, color_buffer, depth_buffer;
    frame_buffer = gl.createFramebuffer();
    color_buffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,color_buffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, window.innerWidth, window.innerHeight, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    depth_buffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,depth_buffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, window.innerWidth,  window.innerHeight, 0,
        gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


    gl.bindFramebuffer(gl.FRAMEBUFFER,frame_buffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,color_buffer,0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depth_buffer,0);

    let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status!=gl.FRAMEBUFFER_COMPLETE){
        console.log("framebuffer invalidly created :" + status.toString() );
    }

    gl.bindTexture(gl.TEXTURE_2D,null);
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    return frame_buffer;
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls,'NumSnowFlakes',3000,10000).step(10);
  gui.add(controls,'LsystemAngle',10,40).step(1);
  gui.add(controls,'LsystemStepsize',0.1,1).step(0.01);
    gui.add(controls,'Load Scene');





  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(0, 20, 60), vec3.fromValues(0, 20, 0));




  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending

    gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const leafShader = new ShaderProgram([
      new Shader(gl.VERTEX_SHADER, require('./shaders/leaf-vert.glsl')),
      new Shader(gl.FRAGMENT_SHADER, require('./shaders/leaf-frag.glsl')),
  ]);

  const groundShader = new ShaderProgram([
      new Shader(gl.VERTEX_SHADER, require('./shaders/ground-vert.glsl')),
      new Shader(gl.FRAGMENT_SHADER, require('./shaders/ground-frag.glsl')),
  ]);

  const snowShader = new ShaderProgram([
      new Shader(gl.VERTEX_SHADER, require('./shaders/snow-vert.glsl')),
      new Shader(gl.FRAGMENT_SHADER, require('./shaders/snow-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();

    stats.begin();
    instancedShader.setTime(time);
    snowShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();



    renderer.render(camera, flat, [screenQuad]);



    renderer.render(camera,groundShader,[plane]);
    renderer.render(camera, instancedShader, [cylinder]);
    renderer.render(camera,leafShader,[Leaf]);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
    renderer.render(camera,snowShader,[snow]);
      gl.disable(gl.BLEND);
      stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
