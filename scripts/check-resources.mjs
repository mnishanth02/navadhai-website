import assert from "node:assert/strict";
import { readFile, realpath, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import parseSrcset from "parse-srcset";
import postcss from "postcss";
import valueParser from "postcss-value-parser";

const origin = "https://build.invalid";

// Check references rather than only enumerating the files that happen to exist.
// External URLs and fragment/data URLs do not name files in this deployment.
export async function checkResources(output, { entry = "index.html", requireApp = true } = {}) {
  const root = await realpath(output);
  const checked = new Set();
  const stylesheets = new Map();

  async function checkReference(value, base, source, stylesheet = false) {
    if (!value || value.trim().startsWith("#")) return;
    const url = new URL(value, base);
    if (url.origin !== origin) return;
    const file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    const inside = (target) => {
      const path = relative(root, target);
      return (
        path !== ".." && !path.startsWith("../") && !path.startsWith("..\\") && !isAbsolute(path)
      );
    };
    assert(inside(file), `Resource escapes build output: ${value} in ${source}`);
    let actual;
    try {
      actual = await realpath(file);
      assert((await stat(actual)).isFile());
    } catch (cause) {
      throw new Error(`Missing resource: ${value} referenced by ${source}`, { cause });
    }
    assert(inside(actual), `Resource escapes build output: ${value} in ${source}`);
    checked.add(relative(root, file).replaceAll("\\", "/"));
    if (stylesheet || url.pathname.endsWith(".css")) stylesheets.set(file, url.href);
  }

  async function checkCss(css, base, source) {
    const references = [];
    const collectUrls = (value) => {
      valueParser(value).walk((node) => {
        if (node.type === "function" && node.value.toLowerCase() === "url") {
          const children = node.nodes.filter((child) => child.type !== "comment");
          const value =
            children.length === 1 && children[0].type === "string"
              ? children[0].value
              : valueParser.stringify(children).trim();
          references.push([value, false]);
          return false;
        }
      });
    };
    const ast = postcss.parse(css, { from: source });
    ast.walkDecls((declaration) => collectUrls(declaration.value));
    ast.walkAtRules((rule) => {
      if (rule.name.toLowerCase() !== "import") return;
      const first = valueParser(rule.params).nodes.find(
        (node) => node.type !== "space" && node.type !== "comment",
      );
      if (first?.type === "string") references.push([first.value, true]);
      else if (first?.type === "function" && first.value.toLowerCase() === "url") {
        const value = valueParser.stringify(first.nodes).trim();
        const parsed = valueParser(value).nodes[0];
        references.push([parsed?.type === "string" ? parsed.value : value, true]);
      }
    });
    for (const [value, stylesheet] of references) {
      await checkReference(value, base, source, stylesheet);
    }
  }

  const html = await readFile(resolve(root, entry), "utf8");
  const dom = new JSDOM(html, { url: `${origin}/${entry}` });
  try {
    const { document } = dom.window;
    if (requireApp)
      assert(document.querySelector('script[type="module"][src]'), "Missing client module script");
    assert(document.querySelector('link[rel~="stylesheet"][href]'), "Missing stylesheet link");
    const base = document.baseURI;
    for (const element of document.querySelectorAll("[src], [poster], object[data], image, use")) {
      for (const attribute of ["src", "poster", "data", "href", "xlink:href"]) {
        if (element.hasAttribute(attribute)) {
          await checkReference(
            element.getAttribute(attribute),
            base,
            `index.html <${element.localName}>`,
          );
        }
      }
    }
    for (const link of document.querySelectorAll("link[href]")) {
      const rel = link.rel.toLowerCase().split(/\s+/);
      if (
        rel.some(
          (value) =>
            ["stylesheet", "preload", "modulepreload", "prefetch", "manifest"].includes(value) ||
            value.endsWith("icon"),
        )
      ) {
        await checkReference(
          link.getAttribute("href"),
          base,
          "index.html <link>",
          rel.includes("stylesheet"),
        );
      }
    }
    for (const element of document.querySelectorAll("[srcset], [imagesrcset]")) {
      for (const attribute of ["srcset", "imagesrcset"]) {
        for (const candidate of parseSrcset(element.getAttribute(attribute) ?? "")) {
          await checkReference(candidate.url, base, `index.html ${attribute}`);
        }
      }
    }
    for (const style of document.querySelectorAll("style")) {
      await checkCss(style.textContent, base, "index.html <style>");
    }
    for (const element of document.querySelectorAll("[style]")) {
      await checkCss(`x { ${element.getAttribute("style")} }`, base, "index.html style attribute");
    }
    const parsed = new Set();
    // Imports may add more stylesheets; the set also breaks circular imports.
    for (const [file, url] of stylesheets) {
      if (parsed.has(file)) continue;
      parsed.add(file);
      await checkCss(await readFile(file, "utf8"), url, relative(root, file));
    }
    return [...checked].sort((left, right) => left.localeCompare(right, "en"));
  } finally {
    dom.window.close();
  }
}
