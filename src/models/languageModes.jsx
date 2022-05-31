export const modes = {
    go: ".go",
    javascript: ".js",
    python: ".py"
}

export const modesForSelect = Object.entries(modes).map(entry => ({label: entry[1], value: entry[0]}));