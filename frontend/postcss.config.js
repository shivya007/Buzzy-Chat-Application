import postcssImport from "postcss-import";
import tailwindcssPostcss from "@tailwindcss/postcss"; // ✅ Use the new PostCSS package
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    postcssImport,
    tailwindcssPostcss, // ✅ Use this instead of tailwindcss
    autoprefixer,
  ],
};
