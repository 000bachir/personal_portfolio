


// Exporting a function named `trim` that trims characters from the beginning and end of a string.
export const trim = (string = '', character?: string) => {
    // Initialize the start index at 0.
    let start: number = 0;

    // Initialize the end index as the length of the string.
    let end = string.length || 0;

    // Move the start index forward as long as the current character matches the specified `character`.
    while (start < end && string[start] === character) ++start;

    // Move the end index backward as long as the current character matches the specified `character`.
    while (end > start && string[end - 1] === character) --end;

    // If `start` or `end` has changed, return the substring from `start` to `end`.
    // Otherwise, return the original string.
    return start > 0 || end < string.length ? string.substring(start, end) : string;
};
