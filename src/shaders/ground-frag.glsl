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
    vec4 col =  vec4(vec3(0.4,0.3,0.1)*lamb,1.f);
    if(fs_Nor.y>0.8) col = vec4(vec3(1.f,1.f,1.f)*lamb,1.f);
    float len = length(fs_Pos);
    out_Col = mix(col,vec4(0.6,0.6,0.6,1.f),clamp(0.f,1.f,len/100.f));
}