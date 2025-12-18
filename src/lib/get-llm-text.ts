import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { remarkInclude } from "fumadocs-mdx/config";
import { source } from "@/lib/source";
import type { InferPageType } from "fumadocs-core/source";

const processor = remark()
  .use(remarkMdx)
  // needed for Fumadocs MDX
  .use(remarkInclude)
  .use(remarkGfm);

export async function getLLMText(page: InferPageType<typeof source>) {
   
  const pageData = page.data as any;
  const processed = await processor.process({
    path: pageData.info?.fullPath ?? page.path,
    value: (await pageData.getText?.("raw")) ?? "",
  });

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${processed.value}`;
}
