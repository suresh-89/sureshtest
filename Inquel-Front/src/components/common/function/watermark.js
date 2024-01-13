export function waterMark(data) {
    return {
        backgroundImage: `url(${
            data && Object.keys(data).length !== 0
                ? data.watermark_image
                    ? data.watermark_image
                    : ""
                : ""
        })`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "contain",
        backgroundPosition: "center",
    };
}
