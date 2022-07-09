export class utils {
  static formatAvatar = (name) => {
    const parts = name.split(" ");
    return (
      parts[0][0].toUpperCase() +
      (parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "")
    );
  };
}
