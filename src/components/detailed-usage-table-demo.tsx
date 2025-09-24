'use client';

import { DetailedUsageTable } from '@/components/billingsdk/detailed-usage-table';

export function DetailedUsageTableDemo() {
   return (
      <DetailedUsageTable
         title="Resource Usage"
         description="Detailed breakdown of your resource consumption"
         resources={[
            {
               name: 'API Calls',
               used: 12300,
               limit: 20000,
               // percentage will be automatically calculated as 61.5%
               unit: 'calls',
            },
            { name: 'Storage', used: 850, limit: 1000, percentage: 85, unit: 'GB' },
            {
               name: 'Team Members',
               used: 4,
               limit: 5,
               // percentage will be automatically calculated as 80%
               unit: 'users',
            },
            {
               name: 'Bandwidth',
               used: 1500,
               limit: 2000,
               percentage: 75,
               unit: 'GB',
            },
            {
               name: 'Emails',
               used: 8500,
               limit: 10000,
               // percentage will be automatically calculated as 85%
               unit: 'emails',
            },
         ]}
      />
   );
}
