"use client";

import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

interface FormWrapperProps {
  title: string;
  children: ReactNode;
}

export function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <AuthenticatedLayout>
      <div className="p-8">
        <ErrorBoundary>
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
    </AuthenticatedLayout>
  );
}
