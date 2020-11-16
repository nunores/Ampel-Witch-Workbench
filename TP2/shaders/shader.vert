#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

uniform float sizeM;
uniform float sizeN;
uniform float M;
uniform float N;

void main(){
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    float horizontal = 1. / sizeM;
    float vertical = 1. / sizeN;
    
    vTextureCoord = vec2(aTextureCoord.s * horizontal + horizontal * M, aTextureCoord.t * vertical + vertical * N);
}
