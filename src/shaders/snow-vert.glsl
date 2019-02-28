#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused

in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

in vec3 vs_Spos;


out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Nor;

void main()
{




    fs_Pos = vs_Pos;

    vec3 pos = vs_Spos.xyz;

    pos.y-=u_Time/50.f;

    pos.y = mod(pos.y,150.f);

    vec3 billboardPos =  pos+ vs_Pos.x * u_CameraAxes[0] + vs_Pos.z * u_CameraAxes[1];




    gl_Position = u_ViewProj * vec4(billboardPos,1.f);
}
