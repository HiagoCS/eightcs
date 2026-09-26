import GlauGrauLogo from "@/assets/images/glau-grau-motopeças.svg?react";
import './bannerStyle.scss'
export default function BannerIllustration({ className = "" }) {
    const colors = {
        background: "#DADADA",
        backgroundLight: "#EEEEEE",
        outline: "#666666",
    };

    return (
        <div className={className}>

            {/* Logo */}
            <GlauGrauLogo className="banner-logo" />
        </div>
    );
}