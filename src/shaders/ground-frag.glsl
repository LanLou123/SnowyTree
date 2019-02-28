#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{
    vec3 ld = normalize(vec3(1.f));
    float lamb = dot(ld,fs_Nor.xyz);
    out_Col =  vec4(vec3(0.4,0.6,0.1)*lamb,1.f);
}