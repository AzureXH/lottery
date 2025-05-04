export default function imagePathPlugin() {
  return {
    name: "vite-plugin-image-path",
    transform(code: string, id: string) {
      if (
        process.env.NODE_ENV === "production" &&
        /src\/assets\/\w+\/index\.ts$/.test(id)
      ) {
        return code.replace(
          /import\s+(\w+)\s+from\s+['"]\.\/([\w-]+\.png)['"]/g,
          (_: any, p1: any, p2: any) => {
            const prefix = id.split("/").slice(-2, -1)[0];
            return `const ${p1} = '${prefix}/${p2}';`;
          }
        );
      }
      return code;
    },
  };
}
