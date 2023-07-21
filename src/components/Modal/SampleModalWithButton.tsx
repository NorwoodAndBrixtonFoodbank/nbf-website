"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal/Modal";

export const longString = "abcdefghijklmnopqrstuvwxyz".repeat(20);

export const longName = `John With A ${"Very ".repeat(20)}Long Name`;
const SampleModalWithButton: React.FC<{}> = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = (): void => {
        setModalIsOpen(true);
    };

    const closeModal = (): void => {
        setModalIsOpen(false);
    };

    return (
        <div id="modal-parent">
            <button onClick={openModal}>Open</button>
            <Modal header="TITLE" isOpen={modalIsOpen} onClose={closeModal}>
                <div style={{ width: "1000px" }}>
                    <div>{longString}</div>
                    <div>{longName}</div>
                </div>
            </Modal>
        </div>
    );
};

export default SampleModalWithButton;
