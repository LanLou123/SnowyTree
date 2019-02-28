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
    vec4 col = vec4(vec3(0.2f,.6f,0.f)*lamb,1);
    if(fs_Nor.y>.8f) col= vec4(vec3(1.f,1.f,1.f)*lamb,1);;
    out_Col =col;
}
