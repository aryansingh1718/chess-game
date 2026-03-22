
export async function loadImages(images: Record<string, HTMLImageElement>) {
    const pieces = ["p","r","n","b","q","k"];
    const colors = ["w","b"];
    const promises = [];

    for (const color of colors) {
        for (const piece of pieces) {
            const key = `${color}${piece}`;
            const img = new Image();
            img.src = `/pieces/${key}.svg`;

            images[key] = img;

            promises.push(
                new Promise((resolve) => {
                    img.onload = resolve
                })
            );
        }
    }
    await Promise.all(promises)     //“Pause execution until EVERY image is loaded”
}