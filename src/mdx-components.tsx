import BannerAnnouncementDemo from '@/components/banner-announcement-demo';
import BannerDemo from '@/components/banner-demo';
import BannerDemoThree from '@/components/banner-demo-three';
import BannerDemoTwo from '@/components/banner-demo-two';
import BannerDestructiveDemo from '@/components/banner-destructive-demo';
import BannerGradientDemo from '@/components/banner-gradient-demo';
import BannerInfoDemo from '@/components/banner-info-demo';
import BannerSuccessDemo from '@/components/banner-success-demo';
import BannerWarningDemo from '@/components/banner-warning-demo';
import { BillingSettings2Demo } from '@/components/billing-settings-2-demo';
import { BillingSummaryCardDemo } from '@/components/billing-summary-card-demo';
import { CancelSubscriptionCardDemo } from '@/components/cancel-subscription-card-demo';
import { CancelSubscriptionCardTwoDemo } from '@/components/cancel-subscription-card-two-demo';
import { CancelSubscriptionDialogDemo } from '@/components/cancel-subscription-dialog-demo';
import { CouponDemo } from '@/components/coupon-demo';
import CustomUsageMeterCircleDemo from '@/components/custom-usage-meter-circle-demo';
import CustomUsageMeterLinearDemo from '@/components/custom-usage-meter-linear-demo';
import { DetailedUsageTableDemo } from '@/components/detailed-usage-table-demo';
import InvoiceHistoryDemo from '@/components/invoice-history-demo';
import { PaymentCardDemo } from '@/components/payment-card-demo';
import { PaymentDetailsDemo } from '@/components/payment-details-demo';
import { PaymentMethodManagerDemo } from '@/components/payment-method-manager-demo';
import { PaymentMethodSelectorDemo } from '@/components/payment-method-selector-demo';
import { PaymentSuccessDialogDemo } from '@/components/payment-success-dialog-demo';
import { PlanRecommendationWidgetDemo } from '@/components/plan-recommendation-widget-demo';
import { PreviewComponents } from '@/components/preview/preview-components';
import { PricingTableFiveDemo } from '@/components/pricing-table-five-demo';
import { PricingTableFiveDemoMinimal } from '@/components/pricing-table-five-minimal-demo';
import { PricingTableFourDemo } from '@/components/pricing-table-four-demo';
import { PricingTableOneDemo } from '@/components/pricing-table-one-demo';
import { PricingTableOneMinimalDemo } from '@/components/pricing-table-one-minimal-demo';
import { PricingTableSevenDemo } from '@/components/pricing-table-seven-demo';
import { PricingTableSixDemo } from '@/components/pricing-table-six-demo';
import { PricingTableThreeDemo } from '@/components/pricing-table-three-demo';
import { PricingTableTwoDemo } from '@/components/pricing-table-two-demo';
import { PricingTableTwoMinimalDemo } from '@/components/pricing-table-two-minimal-demo';
import { ProrationPreviewDemo } from '@/components/proration-preview-demo';
import { SubscriptionManagementDemo } from '@/components/subscription-management-demo';
import { UpcomingChargesDemo } from '@/components/upcoming-charges-demo';
import { UpdatePlanCardDemo } from '@/components/update-plan-card-demo';
import { UpdatePlanDialogDemo } from '@/components/update-plan-dialog-demo';
import { UsageBasedPricingDemo } from '@/components/usage-based-pricing-demo';
import UsageMeterCircleDemo from '@/components/usage-meter-circle-demo';
import UsageMeterLinearDemo from '@/components/usage-meter-linear-demo';
import UsageTableDemo from '@/components/usage-table-demo';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ...TabsComponents,
    PreviewComponents,
    PricingTableOneDemo,
    PricingTableOneMinimalDemo,
    PricingTableTwoDemo,
    PricingTableTwoMinimalDemo,
    PricingTableThreeDemo,
    PricingTableFourDemo,
    PricingTableFiveDemo,
    PricingTableFiveDemoMinimal,
    CancelSubscriptionCardDemo,
    CancelSubscriptionCardTwoDemo,
    CancelSubscriptionDialogDemo,
    SubscriptionManagementDemo,
    UpdatePlanDialogDemo,
    UpdatePlanCardDemo,
    UsageMeterLinearDemo,
    CustomUsageMeterCircleDemo,
    UsageMeterCircleDemo,
    CustomUsageMeterLinearDemo,
    BannerDemo,
    BannerDemoTwo,
    BannerDemoThree,
    BannerGradientDemo,
    BannerDestructiveDemo,
    BannerWarningDemo,
    BannerSuccessDemo,
    BannerInfoDemo,
    BannerAnnouncementDemo,
    InvoiceHistoryDemo,
    UsageTableDemo,
    PaymentMethodSelectorDemo,
    PaymentMethodManagerDemo,
    PaymentSuccessDialogDemo,
    PaymentDetailsDemo,
    PaymentCardDemo,
    ProrationPreviewDemo,
    CouponDemo,
    BillingSummaryCardDemo,
    UpcomingChargesDemo,
    PricingTableSixDemo,
    DetailedUsageTableDemo,
    PricingTableSevenDemo,
    BillingSettings2Demo,
    UsageBasedPricingDemo,
    PlanRecommendationWidgetDemo
  };
}