# Tree in snow
## A L-system procedural tree in webGL 
#### pennkey and name : lanlou
![](tree.gif)


## Base structure:
- Lsystem class : a container class for all Lsystem related elements:
  - member variables:
    - ```NodeList``` : a list of Node to store the position of all Node like feature, like flower or leaf
    - ```BranchList``` : a list for Branches,each one of which containing the branch start pos,end pos, and four transform vectors
    - ```Angle``` : the angle to guide the orientation of turtle
    - ```stepSize``` : the size of step for each move of the turtle
    - ```Grammar```: input grammars
    - ```iterations``` : grammar list for each iteration
    - ```Expansion```: map between grammars and axiom
  - member functions:
    - constructor
    - advanceGrammar : crack the current grammar through the expansion map
    - appendExpansionOps: populate the map
    - doThings: specify consequence for each operation done by the turtle according to the grammar string
    - getIteration: get grammar for current iteration and populate the Iteration list
    - readString: read the input base grammar.
- Turtle class : a class for guiding the turtle's movement around the scene
  - member variables:
    - ```pos``` : current postition of turtle
    - ```up``` : up direction of turtle
    - ```look```: look dir
    - ```right``` : right dir
    - ```depth```: depth of turtle, increamented each time the turtle move forward
    - ```transform```:a transforming matrix for mapping the turtle from current to original
  - member functions:
    - moveforward : move the turtle forward and change the member variables accordingly
    - rotateAroundUp : same story
    - rotateAroundLook : same story
    - rotateAroundRight : same story


## Instance rendering

- This project made use of instancing in webGL ,the reason why instancing matters is that When drawing many instances of a model we'll quickly reach a performance bottleneck because of the many drawing calls. Compared to rendering the actual vertices, telling the GPU to render your vertex data with functions like glDrawArrays or glDrawElements eats up quite some performance since OpenGL must make necessary preparations before it can draw your vertex data (like telling the GPU which buffer to read data from, where to find vertex attributes and all this over the relatively slow CPU to GPU bus). So even though rendering your vertices is super fast, giving your GPU the commands to render them isn't. It would be much more convenient if we could send some data over to the GPU once and then tell OpenGL to draw multiple objects with a single drawing call using this data.
- Instancing is done by calling ``` gl.drawElementsInstanced``` instead of   ```gl.drawElements```, there is an extra parameter to the end indicating how many instances we want there to be.
- once a single geometry is drawn multiple times(in constant amount of draw call) we only have to pass corresponding transforms for each geometry instance, for this project, they are: different location, orientation ,scale of tree branches, different location of leaf, different location of snowflakes,
- the transformation buffers are passed to GPU(shaders) throgh VertexAttribArray, where we have a change to make for ```vertexAttribDivisor```, we have to make the divisor 1, which ensure we increament 1 instance a time
    
    
## Gui controls:
- NumSnowFlakes: number of instances for snow flakes
- LSystemAngle : the turning angle for lsystem
- LsystemStepsize : the step size for each move of turtle
- load scene : don't forget to push this button once u change one of the above properties
    
## Reference
- [algorithm for botany](http://algorithmicbotany.org/papers/#abop)
