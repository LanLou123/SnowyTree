import { vec3, vec4, mat4 } from 'gl-matrix';
import { Turtle } from './Turtle';
export class Branch {
    constructor(start, end, starts = 1, ends = 1, look, up, right, t1, t2, t3, t4, dp) {
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
        this.depth = dp;
    }
}
export class Node {
    constructor(pos, type) {
        this.pos = pos;
        this.type = type;
    }
}
export class Lsystem {
    constructor() {
        this.NodeList = [];
        this.BranchList = [];
        this.Angle = 20;
        this.StepSize = 0.2;
        this.Iterations = [];
        this.maxdp = 0;
        this.Expansion = new Map();
    }
    clear() {
        this.NodeList = [];
        this.BranchList = [];
        this.Iterations = [];
        this.Current = "";
        this.Expansion.clear();
    }
    setAngle(deg) {
        this.Angle = deg;
    }
    setStepSize(dis) {
        this.StepSize = dis;
    }
    getrndAngle() {
        let p = Math.random();
        if (p > 0 && p < 0.2) {
            return this.Angle / 1.6;
        }
        else if (p > 0.2 && p < 0.4) {
            return this.Angle / 1.3;
        }
        else if (p > 0.4 && p < 0.6) {
            return this.Angle;
        }
        else if (p > 0.6 && p < 0.8) {
            return this.Angle * 1.3;
        }
        return this.Angle * 1.6;
    }
    advanceGrammar(str) {
        let res = "";
        for (let i = 0; i < str.length; i++) {
            let cur = str.substr(i, 1);
            let next = "";
            if (this.Expansion.has(cur)) {
                next = this.Expansion.get(cur);
            }
            else {
                next = cur;
            }
            res += next;
        }
        return res;
    }
    appendExpansionOps(str) {
        let idx = -1;
        str.replace(" ", "");
        if (str.length == 0)
            return;
        idx = str.indexOf("->");
        if (idx != -1) {
            let original = str.substr(0, idx);
            let expanded = str.substr(idx + 2);
            this.Expansion.set(original, expanded);
        }
        else
            this.Current = str;
    }
    doThings(n) {
        let turtle = new Turtle();
        let stack = new Array();
        let tx = this.getInteration(n);
        turtle.rotateAroundRight(-90);
        for (let i = 0; i < tx.length; i++) {
            let cur = tx.substr(i, 1);
            if (cur == "F") {
                let start = vec3.fromValues(turtle.pos[0], turtle.pos[1], turtle.pos[2]);
                let up = vec3.fromValues(turtle.up[0], turtle.up[1], turtle.up[2]);
                let look = vec3.fromValues(turtle.look[0], turtle.look[1], turtle.look[2]);
                let right = vec3.fromValues(turtle.right[0], turtle.right[1], turtle.right[2]);
                let t1 = vec4.fromValues(turtle.transform[0], turtle.transform[1], turtle.transform[2], turtle.transform[3]);
                let t2 = vec4.fromValues(turtle.transform[4], turtle.transform[5], turtle.transform[6], turtle.transform[7]);
                let t3 = vec4.fromValues(turtle.transform[8], turtle.transform[9], turtle.transform[10], turtle.transform[11]);
                let t4 = vec4.fromValues(turtle.transform[12], turtle.transform[13], turtle.transform[14], turtle.transform[15]);
                let p = Math.random();
                if (p > 0.3) {
                    turtle.moveforward(this.StepSize);
                }
                else {
                    turtle.moveforward(this.StepSize * 1.5);
                }
                let end = vec3.create();
                vec3.copy(end, turtle.pos);
                this.BranchList.push(new Branch(start, end, Math.max(0.05, Math.pow(0.95, turtle.depth)), Math.max(0.05, Math.pow(0.95, turtle.depth + 1)), look, up, right, t1, t2, t3, t4, turtle.depth));
                this.maxdp = Math.max(this.maxdp, turtle.depth);
            }
            else if (cur == "f") {
                turtle.moveforward(this.StepSize);
                this.maxdp = Math.max(this.maxdp, turtle.depth);
            }
            else if (cur == "+") {
                turtle.rotateAroundUp(this.getrndAngle());
            }
            else if (cur == "-") {
                turtle.rotateAroundUp(-this.getrndAngle());
            }
            else if (cur == "&") {
                turtle.rotateAroundRight(this.getrndAngle());
            }
            else if (cur == "^") {
                turtle.rotateAroundRight(-this.getrndAngle());
            }
            else if (cur == "\\") {
                turtle.rotateAroundLook(this.getrndAngle());
            }
            else if (cur == "/") {
                turtle.rotateAroundLook(-this.getrndAngle());
            }
            else if (cur == "|") {
                turtle.rotateAroundLook(180);
            }
            else if (cur == "[") {
                let curt = new Turtle();
                vec3.copy(curt.pos, turtle.pos);
                vec3.copy(curt.up, turtle.up);
                vec3.copy(curt.look, turtle.look);
                vec3.copy(curt.right, turtle.right);
                mat4.copy(curt.transform, turtle.transform);
                curt.depth = turtle.depth;
                stack.push(curt);
            }
            else if (cur == "]") {
                turtle = stack.pop();
            }
            else if (cur == "*") {
                let pos = vec3.fromValues(turtle.pos[0], turtle.pos[1], turtle.pos[2]);
                this.NodeList.push(new Node(pos, cur));
            }
        }
    }
    getInteration(n) {
        if (n >= this.Iterations.length) {
            for (let i = this.Iterations.length; i <= n; i++) {
                this.Current = this.advanceGrammar(this.Current);
                this.Iterations.push(this.Current);
            }
        }
        return this.Iterations[n];
    }
    readString(str) {
        this.clear();
        this.Grammar = str;
        let i = 0;
        while (i < str.length) {
            let lineEnd = str.indexOf("\n", i);
            let line = str.substr(i, lineEnd - i).trim();
            this.appendExpansionOps(line);
            if (lineEnd == -1)
                break;
            i = lineEnd + 1;
        }
    }
}
//# sourceMappingURL=Lsystem.js.map