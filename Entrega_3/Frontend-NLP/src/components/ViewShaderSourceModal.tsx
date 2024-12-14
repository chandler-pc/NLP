import React from 'react'
import { Button } from "./ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"

interface ViewShaderSourceModalProps {
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    shaderCode: string;
}

export const ViewShaderSourceModal: React.FC<ViewShaderSourceModalProps> = ({ isModalOpen, setIsModalOpen, shaderCode }) => {
    return (
        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Shader</DialogTitle>
                    <DialogDescription>
                        Código fuente del shader
                    </DialogDescription>
                </DialogHeader>
                <textarea
                    className="border p-3 w-full h-60 resize-none rounded-md focus:outline-none focus:ring focus:ring-indigo-500 shadow-sm"
                    readOnly
                    value={shaderCode}
                />
                <DialogFooter>
                    <Button onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}