#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused

in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

in vec3 vs_Lpos;


out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Nor;

void main()
{

    fs_Pos = vs_Pos;


    fs_Nor = vs_Nor;

    mat4 sc = mat4(0.003);
    sc[3][3] = 1.f;


    vec4 billboardPos =  vec4(vs_Lpos,0.f)+ sc*vs_Pos;




    gl_Position = u_ViewProj * billboardPos;
}
