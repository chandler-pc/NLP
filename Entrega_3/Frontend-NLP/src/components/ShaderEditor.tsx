import React, { useState, useEffect, useRef } from 'react';
import { Button } from "./ui/button";
import { ViewShaderSourceModal } from './ViewShaderSourceModal';
import { ChatInput } from './ChatInput';

interface ShaderEditorProps {
    socket: any;
    shaderCode: string;
}

export const ShaderEditor: React.FC<ShaderEditorProps> = ({ socket, shaderCode }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported');
            return;
        }
        glRef.current = gl;

        const vertexShaderSource = `
            attribute vec4 position;
            varying vec2 vUv;
            void main() {
                vUv = position.xy * 0.5 + 0.5;
                gl_Position = position;
            }
        `;

        const compileShader = (source: string, type: number) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(shaderCode, gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        programRef.current = program;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
            gl.STATIC_DRAW
        );

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLocation);

        let startTime = Date.now();

        const render = () => {
            gl.useProgram(program);

            const timeLocation = gl.getUniformLocation(program, 'time');
            gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(render);
        };

        render();

        return () => {
            gl.deleteProgram(program);
        };
    }, [shaderCode]);

    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-full max-h-screen p-4 bg-gray-50">

            <div className="flex-grow flex justify-center items-center bg-white shadow rounded-md overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full max-w-full max-h-full"
                />
            </div>

            <div className="flex flex-col w-full md:w-1/3 space-y-4">
                <ChatInput
                    onSendMessage={(data: string) => { 
                        socket?.emit('generateShader', { shaderCode, prompt: data });
                     }}
                    promptMessage="Escribe como quieres tu shader"
                />
                <Button onClick={() => setIsModalOpen(true)}>
                    View Shader Code
                </Button>
                <ViewShaderSourceModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    shaderCode={shaderCode}
                />
            </div>
        </div>
    );
};
