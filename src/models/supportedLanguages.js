export const supportedLanguageIcons = {
    go: "https://logo-download.com/wp-content/data/images/png/Go-logo.png",
    javascript: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png",
    python: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/2048px-Python-logo-notext.svg.png",
    c: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/C_Programming_Language.svg/695px-C_Programming_Language.svg.png",
    cpp: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    java: "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/800px-Java_programming_language_logo.svg.png",
    rust: "http://rust-lang.org/logos/rust-logo-512x512.png",
    shell: "https://icon-library.com/images/terminal-icon-png/terminal-icon-png-16.jpg",
    toml: "https://icons-for-free.com/download-icon-TOML-1324888769765211235_512.icns"
}

export const supportedLanguages = [
    { name: "go", iconUrl: supportedLanguageIcons["go"] },
    { name: "javascript", iconUrl: supportedLanguageIcons["javascript"] },
    { name: "python", iconUrl: supportedLanguageIcons["python"] },
    { name: "c", iconUrl: supportedLanguageIcons["c"] },
    { name: "c++", iconUrl: supportedLanguageIcons["cpp"] },
    { name: "java", iconUrl: supportedLanguageIcons["java"] },
    { name: "rust", iconUrl: supportedLanguageIcons["rust"] },
]

export const fileExtensionToIcon = (extension) => {
    switch (extension) {
        case "go":
            return supportedLanguageIcons["go"];
        case "js":
        case "json":
            return supportedLanguageIcons["javascript"];
        case "py":
            return supportedLanguageIcons["python"];
        case "c":
        case "h":
            return supportedLanguageIcons["c"];
        case "cpp":
        case "cc":
        case "hpp":
        case "hh":
            return supportedLanguageIcons["cpp"];
        case "java":
        case "class":
            return  supportedLanguageIcons["java"];
        case "sh":
            return  supportedLanguageIcons["shell"];
        case "rs":
        case "rslib":
            return supportedLanguageIcons["rust"];
        case "toml":
            return supportedLanguageIcons["toml"];
        default:
            return "https://icon-library.com/images/file-icon-svg/file-icon-svg-11.jpg";
    }
}