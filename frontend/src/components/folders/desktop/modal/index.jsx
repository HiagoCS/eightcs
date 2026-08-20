import "./style.scss";
import { useEffect, useState } from "react";
import ArrowRight from '@/assets/icons/arrow-right-svgrepo-com.svg?react';
import ArrowLeft from '@/assets/icons/arrow-left-svgrepo-com.svg?react';
import CloseIcon from '@/assets/icons/close-svgrepo-com.svg?react';

const imageFiles = import.meta.glob(
    "@/assets/img/desktop-carousel/*/modal/*.{png,jpg,jpeg,webp}",
    {
        eager: true,
        query: "?url",
        import: "default"
    }
);

function getModalImage(projectId, modalId, extension) {
    const target = `/desktop-carousel/${projectId}/modal/${modalId}${extension}`;

    const image = Object.entries(imageFiles).find(
        ([path]) => path.includes(target)
    );

    return image ? image[1] : null;
}

export default function DesktopModal({ project, onClose }) {

    const [currentIndex, setCurrentIndex] = useState(0);

    const modal = project.modal;
    const currentItem = modal[currentIndex];

    const image = getModalImage(
        currentItem.project_id,
        currentItem.id,
        currentItem.extension
    );

    const next = () => {
        setCurrentIndex((current) =>
            current === modal.length - 1 ? 0 : current + 1
        );
    };

    const previous = () => {
        setCurrentIndex((current) =>
            current === 0 ? modal.length - 1 : current - 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (event) => {

            if (event.key === "Escape") {
                onClose();
            }

            if (event.key === "ArrowRight") {
                next();
            }

            if (event.key === "ArrowLeft") {
                previous();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [modal.length]);

    return (
        <div className="modal">
            <div className="close" onClick={onClose}>
                <CloseIcon style={{width:'2.5vw', height:'2.5vh'}} />
            </div>
            <div className="previous" onClick={previous}>
                <ArrowLeft style={{width:'2.5vw', height:'2.5vh'}} />
            </div>

            <div className="modal-content">

                <div className="image">
                    {image && (
                        <img
                            src={image}
                            alt={currentItem.text}
                        />
                    )}
                </div>

                <div className="info">

                    <h2>{project.title}</h2>

                    <span>
                        {currentItem.text}
                    </span>

                    <div className="counter">
                        {currentIndex + 1} / {modal.length}
                    </div>

                </div>

            </div>
            <div className="next" onClick={next}>
                <ArrowRight style={{width:'2.5vw', height:'2.5vh'}}></ArrowRight>
            </div>
        </div>
    );
}