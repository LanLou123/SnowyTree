#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{
    vec3 ld = normalize(vec3(1));
    float lamb = dot(ld,normalize(fs_Nor.xyz));
    vec4 col =  vec4(vec3(0.8,0.6,0.0)*lamb,1);
    vec3 nor = normalize(fs_Nor.xyz);
    if(nor.y>0.06) col =  vec4(vec3(1.f,1.f,1.0)*lamb,1.f);
    out_Col = col;
}
