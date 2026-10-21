import "./style.scss";
import { useEffect, useState } from "react";

import ArrowRight from "@/assets/icons/arrow-right-svgrepo-com.svg?react";
import ArrowLeft from "@/assets/icons/arrow-left-svgrepo-com.svg?react";
import CloseIcon from "@/assets/icons/close-svgrepo-com.svg?react";

export default function Modal({ project, onClose, images = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const modalItems = project?.modal ?? [];
    const itemCount = modalItems.length;

    const sortedImages = [...images].sort((a, b) => {
        const getNumber = (path) => {
            const fileName = path.split("/").pop() ?? "";
            const match = fileName.match(/^\d+/);

            return match ? Number(match[0]) : Infinity;
        };

        return getNumber(a) - getNumber(b);
    });

    const currentItem = modalItems[currentIndex];
    const image = sortedImages[currentIndex];

    const next = () => {
        if (itemCount <= 1) return;

        setCurrentIndex((current) =>
            current >= itemCount - 1 ? 0 : current + 1
        );
    };

    const previous = () => {
        if (itemCount <= 1) return;

        setCurrentIndex((current) =>
            current === 0 ? itemCount - 1 : current - 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }

            if (itemCount <= 1) return;

            if (event.key === "ArrowRight") {
                setCurrentIndex((current) =>
                    current >= itemCount - 1 ? 0 : current + 1
                );
            }

            if (event.key === "ArrowLeft") {
                setCurrentIndex((current) =>
                    current === 0 ? itemCount - 1 : current - 1
                );
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, itemCount]);

    return (
        <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes do projeto ${project?.title ?? ""}`}
        >
            <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Fechar modal"
            >
                <CloseIcon className="icon" />
            </button>

            <button
                type="button"
                className="previous"
                onClick={previous}
                aria-label="Imagem anterior"
            >
                <ArrowLeft className="icon" />
            </button>

            <div className="modal-content">
                <div className="image">
                    {image && (
                        <img
                            src={`${import.meta.env.VITE_API_URL}${image}`}
                            alt={currentItem?.text || project?.title || "Imagem do projeto"}
                        />
                    )}
                </div>

                <div className="info">
                    <h2>{project?.title}</h2>

                    <span>{currentItem?.text ?? ""}</span>

                    <div className="counter">
                        {itemCount > 0
                            ? `${currentIndex + 1} / ${itemCount}`
                            : "0 / 0"}
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="next"
                onClick={next}
                aria-label="Próxima imagem"
            >
                <ArrowRight className="icon" />
            </button>
        </div>
    );
}