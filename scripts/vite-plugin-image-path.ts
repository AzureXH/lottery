// @ts-nocheck
export default function imagePathPlugin() {
  return {
    name: "vite-plugin-image-path",
    transform(code: string, id: string) {
      if (process.env.NODE_ENV === "production") {
        if (/src\/assets\/Award\/index\.ts$/.test(id)) {
          // 自动提取import语句
          const importRegex =
            /import\s+(\w+)\s+from\s+['"]\.\/(\w+)\/(\w+\.png)['"]/g;
          const groups = {};
          let match;
          while ((match = importRegex.exec(code))) {
            const [, varName, group, file] = match;
            if (!groups[group]) groups[group] = {};
            // Star特殊处理
            if (/star/i.test(varName)) {
              groups[group]["Star"] = `/Award/${group}/${file}`;
            } else {
              groups[group][varName] = `/Award/${group}/${file}`;
            }
          }
          // 构造AwardImages字符串
          const groupOrder = ["N", "R", "SR", "SSR"];
          let objStr = "export const AwardImages = {\n";
          for (const group of groupOrder) {
            objStr += `  ${group}: {\n`;
            for (const key in groups[group] || {}) {
              objStr += `    ${key}: '${groups[group][key]}',\n`;
            }
            objStr += "  },\n";
          }
          objStr += "};\n\nexport default {\n  images: AwardImages,\n};\n";
          return objStr;
        }
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
