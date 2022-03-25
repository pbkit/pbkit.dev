import toc from "../docs/toc.json" assert { type: "json" };
import { titleCase } from "https://deno.land/x/case@2.1.1/mod.ts";
import { walk } from "https://deno.land/std@0.130.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.130.0/path/mod.ts";

type RawTableOfContents = Record<string, RawTableOfContentsEntry>;

interface RawTableOfContentsEntry {
  title: string;
  pages: [string, string][];
}

export interface TableOfContentsEntry {
  slug: string;
  title: string;
  category?: string;
  href: string;
  file: string;
}

export interface TableOfContentsCategory {
  title: string;
  href: string;
  entries: TableOfContentsCategoryEntry[];
}

export interface TableOfContentsCategoryEntry {
  title: string;
  href: string;
}

export const TABLE_OF_CONTENTS: Record<string, TableOfContentsEntry> = {};
export const CATEGORIES: TableOfContentsCategory[] = [];

const DOCS_DIR = "./docs";
const PARENT_NAME = "index";

const RAW_TOC: RawTableOfContents = toc.categories.reduce<RawTableOfContents>(
  (prev, category) => {
    return {
      ...prev,
      [category]: {
        title: titleCase(category),
        pages: [],
      },
    };
  },
  {} as RawTableOfContents,
);
for await (const entry of walk(DOCS_DIR, { exts: [".md"] })) {
  const relativePath = path.relative(DOCS_DIR, entry.path);
  const relativeDir = path.dirname(relativePath);
  const { name } = path.parse(entry.name);
  if (relativeDir === ".") continue;
  if (!RAW_TOC[relativeDir]) {
    RAW_TOC[relativeDir] = {
      title: titleCase(relativeDir),
      pages: name === PARENT_NAME ? [] : [[name, titleCase(name)]],
    };
  } else {
    if (name !== PARENT_NAME) {
      RAW_TOC[relativeDir].pages.push([
        name,
        titleCase(name),
      ]);
    }
  }
}

for (const parent in RAW_TOC) {
  const rawEntry = RAW_TOC[parent];
  const href = `/docs/${parent}`;
  const file = `docs/${parent}/index.md`;
  const entry = {
    slug: parent,
    title: rawEntry.title,
    href,
    file,
  };
  TABLE_OF_CONTENTS[parent] = entry;
  const category: TableOfContentsCategory = {
    title: rawEntry.title,
    href,
    entries: [],
  };
  CATEGORIES.push(category);
  if (rawEntry.pages) {
    for (const [id, title] of rawEntry.pages) {
      const slug = `${parent}/${id}`;
      const href = `/docs/${slug}`;
      const file = `docs/${slug}.md`;
      const entry = { slug, title, category: parent, href, file };
      TABLE_OF_CONTENTS[slug] = entry;
      category.entries.push({
        title,
        href,
      });
    }
  }
}

export const SLUGS = Object.keys(TABLE_OF_CONTENTS);
