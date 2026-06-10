'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MasterDataTable } from './master-data-table';

export function ManagementTabs() {
  return (
    <Tabs defaultValue="department" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="department">Department</TabsTrigger>
        <TabsTrigger value="position">Position</TabsTrigger>
        <TabsTrigger value="prefix">Prefix</TabsTrigger>
      </TabsList>
      <TabsContent value="department" className="mt-4">
        <MasterDataTable
          entity="department"
          title="Departments"
          description="Create, edit, and delete department master data."
          singularLabel="Department"
        />
      </TabsContent>
      <TabsContent value="position" className="mt-4">
        <MasterDataTable
          entity="position"
          title="Positions"
          description="Create, edit, and delete position master data."
          singularLabel="Position"
        />
      </TabsContent>
      <TabsContent value="prefix" className="mt-4">
        <MasterDataTable
          entity="prefix"
          title="Prefixes"
          description="Create, edit, and delete prefix master data."
          singularLabel="Prefix"
        />
      </TabsContent>
    </Tabs>
  );
}
