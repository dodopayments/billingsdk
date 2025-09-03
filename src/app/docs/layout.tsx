import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';
import { FaGithub, FaRegFileAlt  } from "react-icons/fa";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
    {...baseOptions}
    tree={source.pageTree}
    links={[
      ...baseOptions.links || [],
      {
        type: 'button',
        text: 'llms-full.txt',
        url: '/llms-full.txt',
        active: 'none',
        icon: <FaRegFileAlt />,
      },
      {
        type: 'icon',
        icon: <FaGithub />,
        text: 'GitHub',
        url: 'https://github.com/dodopayments/billingsdk',
      },
    ]}
    disableThemeSwitch={true}
  >
    {children}
  </DocsLayout>
  );
}
