#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

#define FOV 45.f
vec3 sky(in vec3 rd){
    return mix(vec3(0.3,0.3,0.3),vec3(0.1,0.2,0.4),clamp(rd.y,0.f,1.f));
}

void main() {

  float sx = (2.f*gl_FragCoord.x/u_Dimensions.x)-1.f;
  float sy = 1.f-(2.f*gl_FragCoord.y/u_Dimensions.y);
  float len = length(u_Ref - u_Eye);
  vec3 forward = normalize(u_Ref - u_Eye);
  vec3 right = cross(forward,u_Up);
  vec3 V = u_Up * len * tan(FOV/2.f);
  vec3 H = right * len * (u_Dimensions.x/u_Dimensions.y) * tan(FOV/2.f);
  vec3 p = u_Ref + sx * H - sy * V;

  vec3 rd = normalize(p - u_Eye);
  vec3 ro = u_Eye;



  out_Col = vec4(sky(rd),1.f);
}
