import {vec3,vec4,mat4} from 'gl-matrix'
import {Turtle} from './Turtle'

export class Branch{
    start : vec3;
    end : vec3;
    startSize:number;
    endSize:number;
    look :vec3;
    up:vec3;
    right:vec3;
    trans1:vec4;
    trans2:vec4;
    trans3:vec4;
    trans4:vec4;
    fixstep :number = 1.3;
    steps :number;

    constructor(start:vec3,
                end:vec3,
                starts:number = 1,
                ends:number = 1,
                look:vec3,
                up:vec3,
                right:vec3,
                t1:vec4,
                t2:vec4,
                t3:vec4,
                t4:vec4){

        this.start = start;
        this.end = end;
        this.startSize = starts;
        this.endSize = ends;
        this.look = look;
        this.up = up;
        this.right = right;
        this.trans1 = t1;
        this.trans2 = t2;
        this.trans3 = t3;
        this.trans4 = t4;
    }
}

export class Node{
    pos : vec3;
    type : string;
    constructor(pos:vec3,type:string){
        this.pos = pos;
        this.type = type;
    }
}

export class Lsystem{
    NodeList : Array<Node> = [];
    BranchList : Array<Branch> = [];
    Angle : number = 20;
    StepSize : number = 0.2;
    Grammar : string;
    Expansion : Map<string,string>;
    Iterations : Array<string> = [];
    Current : string;
    constructor(){this.Expansion = new Map<string, string>()}

    clear(){
        this.NodeList = [];
        this.BranchList = [];
        this.Iterations = [];
        this.Current = "";
        this.Expansion.clear();
    }


    setAngle(deg:number){
        this.Angle = deg;
    }

    setStepSize(dis:number){
        this.StepSize = dis;
    }

    advanceGrammar(str:string){
        let res = "";
        for(let i=0;i<str.length;i++){
            let cur = str.substr(i,1);
            let next = "";
            if(this.Expansion.has(cur)){
                next = this.Expansion.get(cur);
            }
            else{
                next = cur;
            }
            res += next;
        }
        return res;
    }

    appendExpansionOps(str:string){
        let idx = -1;
        str.replace(" ","");
        if(str.length==0) return;
        idx = str.indexOf("->");
        if(idx!=-1){
            let original = str.substr(0,idx);
            let expanded = str.substr(idx+2);
            this.Expansion.set(original,expanded);
        }
        else this.Current = str;
    }


    doThings(n:number){
        let turtle = new Turtle();
         turtle.steps = this.StepSize;
        let stack = new Array();
        let tx = this.getInteration(n);
        turtle.rotateAroundRight(-90);
        for(let i = 0;i<tx.length;i++){
            let cur = tx.substr(i,1);
            if(cur == "F"){
                let start = vec3.fromValues(turtle.pos[0],turtle.pos[1],turtle.pos[2]);
                let up = vec3.fromValues(turtle.up[0],turtle.up[1],turtle.up[2]);
                let look = vec3.fromValues(turtle.look[0],turtle.look[1],turtle.look[2]);
                let right = vec3.fromValues(turtle.right[0],turtle.right[1],turtle.right[2]);
                let t1:vec4 = vec4.fromValues(turtle.transform[0],turtle.transform[1],turtle.transform[2],turtle.transform[3]);
                let t2:vec4 = vec4.fromValues(turtle.transform[4],turtle.transform[5],turtle.transform[6],turtle.transform[7]);
                let t3:vec4 = vec4.fromValues(turtle.transform[8],turtle.transform[9],turtle.transform[10],turtle.transform[11]);
                let t4:vec4 = vec4.fromValues(turtle.transform[12],turtle.transform[13],turtle.transform[14],turtle.transform[15]);
                let p = Math.random();
                if(p>0.3) {
                    turtle.steps = this.StepSize;
                    turtle.moveforward(this.StepSize);

                }
                else {
                    turtle.steps = this.StepSize*1.5;
                    turtle.moveforward(this.StepSize*1.5);

                }
                let end = vec3.create();
                vec3.copy(end,turtle.pos);
                this.BranchList.push(new Branch(start,end,
                    Math.max(0.05,Math.pow(0.95,turtle.depth)),
                    Math.max(0.05,Math.pow(0.95,turtle.depth+1)),
                    look,
                    up,
                    right,t1,t2,t3,t4));
            }
            else if(cur =="f"){
                turtle.steps = this.StepSize;
                turtle.moveforward(this.StepSize);
            }
            else if(cur == "+"){
                turtle.rotateAroundUp(this.Angle);
            }
            else if(cur =="-"){
                turtle.rotateAroundUp(-this.Angle);
            }
            else if(cur =="&"){
                turtle.rotateAroundRight(this.Angle);
            }
            else if(cur =="^"){
                turtle.rotateAroundRight(-this.Angle);
            }
            else if(cur =="\\"){
                turtle.rotateAroundLook(this.Angle);
            }
            else if(cur=="/"){
                turtle.rotateAroundLook(-this.Angle);
            }
            else if(cur =="|"){
                turtle.rotateAroundLook(180);
            }
            else if(cur =="["){
                let curt = new Turtle();
                vec3.copy(curt.pos,turtle.pos);
                vec3.copy(curt.up,turtle.up);
                vec3.copy(curt.look,turtle.look);
                vec3.copy(curt.right,turtle.right);
                mat4.copy(curt.transform,turtle.transform);
                curt.depth = turtle.depth;
                curt.steps = turtle.steps;
                stack.push(curt);
            }
            else if(cur=="]"){
                turtle = stack.pop();
            }
            else if(cur =="*"){
                let pos:vec3 = vec3.fromValues(turtle.pos[0],turtle.pos[1],turtle.pos[2]);
                this.NodeList.push(new Node(pos,cur));
            }
        }
    }


    getInteration(n:number){
        if(n>=this.Iterations.length){
            for(let i = this.Iterations.length;i<=n;i++){
                this.Current = this.advanceGrammar(this.Current);
                this.Iterations.push(this.Current);
            }
        }
        return this.Iterations[n];
    }

    readString(str:string){
        this.clear();
        this.Grammar = str;

        let i = 0;
        while(i<str.length){
            let lineEnd = str.indexOf("\n",i);
            let line = str.substr(i,lineEnd-i).trim();
            this.appendExpansionOps(line);
            if(lineEnd==-1) break;
            i = lineEnd+1;
        }
    }



}