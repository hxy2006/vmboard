import type { SearchParams } from "@/types";
import * as React from "react";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DateRangePicker } from "@/components/date-range-picker";
import { Shell } from "@/components/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { getValidFilters } from "@/lib/data-table";
import { CreateVMSheet } from "@/components/vm/create-vm-sheet";
import { FeatureFlagsProvider } from "../../components/vm/feature-flags-provider";
import { VMsTable } from "../../components/vm/vms-table";
import { getMerchants, getVMs, getVMStatusCounts } from "../_lib/queries";
import { searchParamsCache } from "../_lib/validations";
import ServerOverview from "@/components/overview-cards";
import { useState } from "react";
import { CreateVMDialog } from "@/components/vm/create-vm-dialog";

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function IndexPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getVMs({
      ...search,
      filters: validFilters,
    }),
    getMerchants(),
    getVMStatusCounts(),
  ]);

  const [vms, merchants, statusCounts] = await promises;

  return (
    <Shell className="gap-2">
      <ServerOverview type="vm" />
      <CreateVMDialog open={vms.data.length === 0} />
      {/* <FeatureFlagsProvider> */}
      {/* <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
            shallow={false}
          />
        </React.Suspense> */}
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
            shrinkZero
          />
        }
      >
        {vms ? <VMsTable promises={promises} /> : <div>promises is null</div>}
      </React.Suspense>
      {/* </FeatureFlagsProvider> */}
    </Shell>
  );
}
