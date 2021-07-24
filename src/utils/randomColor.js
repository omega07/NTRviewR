export function randomColor() {
    const colors = ['orange', 'yellow', 'red', 'green'];
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
}

