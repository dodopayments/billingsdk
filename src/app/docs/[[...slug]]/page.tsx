import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/mdx-components';
import { CombinedAIButton } from '@/components/page-actions';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  
  // Extract component name from the path for playground integration
  const getComponentName = (slug?: string[]): string | undefined => {
    if (!slug || slug.length < 2) return undefined;
    
    // Check if this is a component page (starts with 'components')
    if (slug[0] !== 'components') return undefined;
    
    // Map component paths to playground component names (matching registry exactly)
    const componentMap: Record<string, string> = {
      'banner': 'Banner',
      'cancel-subscription/cancel-subscription-card': 'Cancel Subscription Card',
      'cancel-subscription/cancel-subscription-dialog': 'Cancel Subscription Dialog',
      'invoice-history': 'Invoice History',
      'payment-method-selector': 'Payment Method Selector',
      'pricing-table/pricing-table-one': 'Pricing Table One',
      'pricing-table/pricing-table-two': 'Pricing Table Two',
      'pricing-table/pricing-table-three': 'Pricing Table Three',
      'pricing-table/pricing-table-five': 'Pricing Table Five',
      'manage-subscription': 'Subscription Management',
      'update-plan/update-plan-card': 'Update Plan Card',
      'update-plan/update-plan-dialog': 'Update Plan Dialog',
      'usage-meter/usage-meter-circle': 'Usage Meter',
      'usage-meter/usage-meter-linear': 'Usage Meter',
      'usage-table': 'Usage Table',
    };
    
    const componentPath = slug.slice(1).join('/');
    return componentMap[componentPath];
  };
  
  const componentName = getComponentName(params.slug);

  return (
    <DocsPage
      full={page.data.full}
      breadcrumb={{
        includePage: true,
        includeSeparator: true,
      }}
    >
      <DocsTitle className="mt-2 flex flex-row justify-between">
        {page.data.title}
        <div className="hidden md:block">
          <CombinedAIButton
            markdownUrl={`${page.url}.mdx`}
            githubUrl={`https://github.com/dodopayments/billingsdk/tree/main/content/docs/${page.path}`}
            componentName={componentName}
          />
        </div>
      </DocsTitle>
      <DocsDescription className="mb-5">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6 mb-5 md:hidden">
        <CombinedAIButton
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/dodopayments/billingsdk/tree/main/content/docs/${page.path}`}
          componentName={componentName}
        />
      </div>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
