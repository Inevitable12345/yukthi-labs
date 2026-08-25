declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXProps } from "mdx/types";

  /** Frontmatter is authored as a named ESM export in each `.mdx` file. */
  export const meta: Record<string, unknown>;
  const MDXComponent: ComponentType<MDXProps>;
  export default MDXComponent;
}
