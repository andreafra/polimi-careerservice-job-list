export function getInitials(name: string) {
    const words = name.split(' ', 2);
    if (words.length > 1) {
        return words[0].charAt(0) + words[1].charAt(0);
    } else {
        return words[0].substring(0, 2);
    }
}